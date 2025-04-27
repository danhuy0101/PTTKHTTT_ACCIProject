const { sql, poolPromise } = require('../../db');
const transporter = require('../utils/emailConfig');


class PhieuDuThiDAO {
    /**
     * Tạo và lưu phiếu dự thi mới vào cơ sở dữ liệu
     * @param {string} maPhieuDangKy - Mã phiếu đăng ký
     * @param {number} maThiSinh - Mã thí sinh
     * @returns {Object} Phiếu dự thi đã tạo
     */
    static async taoPhieuDuThi(maPhieuDangKy, maThiSinh) {
        try {
            const pool = await poolPromise;
            
            // Tạo mã phiếu dự thi tự động
            const nextIdResult = await pool.request().query(`
                SELECT 'PDT' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(RIGHT(MAPHIEUDUTHI, 7) AS INT)), 0) + 1 AS VARCHAR(7)), 7) AS NextId
                FROM PHIEUDUTHI
            `);
            
            const newId = nextIdResult.recordset[0].NextId;
            
            // Kiểm tra phiếu đăng ký có tồn tại không
            const pdkResult = await pool.request()
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .query(`
                    SELECT MAKHACHHANG, MALICHTHI, MANHANVIEN
                    FROM PHIEUDANGKY
                    WHERE MAPHIEUDANGKY = @maPhieuDangKy
                `);
            
            if (pdkResult.recordset.length === 0) {
                throw new Error(`Không tìm thấy mã phiếu đăng ký ${maPhieuDangKy}`);
            }
            
            const MANHANVIEN = 'NV0000004';
            
            console.log(`Sử dụng mã thí sinh: ${maThiSinh} cho phiếu đăng ký: ${maPhieuDangKy}`);
            
            // Tạo số báo danh tự động dưới dạng "0xxxxx"
            const nextSBDResult = await pool.request().query(`
                SELECT RIGHT('000000' + CAST(ISNULL(MAX(CAST(SBD AS INT)), 0) + 1 AS VARCHAR(6)), 6) AS NextSBD
                FROM PHIEUDUTHI
            `);
            
            const newSBD = nextSBDResult.recordset[0].NextSBD;
            
            const today = new Date().toISOString().split('T')[0];
            
            // Thêm phiếu dự thi mới vào cơ sở dữ liệu
            await pool.request()
                .input('newId', sql.NVarChar, newId)
                .input('newSBD', sql.NVarChar, newSBD)
                .input('today', sql.Date, today)
                .input('MANHANVIEN', sql.NVarChar, MANHANVIEN)
                .input('maPhieuDangKy', sql.NVarChar, maPhieuDangKy)
                .input('MATHISINH', sql.Int, maThiSinh)
                .query(`
                    INSERT INTO PHIEUDUTHI (MAPHIEUDUTHI, SBD, TRANGTHAI, NGAYPHATHANH, MANHANVIEN, MAPHIEUDANGKY, MATHISINH)
                    VALUES (@newId, @newSBD, N'Chưa gửi', @today, @MANHANVIEN, @maPhieuDangKy, @MATHISINH)
                `);
            
            // Lấy thông tin phiếu dự thi vừa tạo
            const result = await pool.request()
                .input('newId', sql.NVarChar, newId)
                .query(`
                    SELECT 
                        MAPHIEUDUTHI,
                        SBD,
                        TRANGTHAI,
                        NGAYPHATHANH,
                        MANHANVIEN,
                        MAPHIEUDANGKY,
                        MATHISINH
                    FROM PHIEUDUTHI
                    WHERE MAPHIEUDUTHI = @newId
                `);
            
            return result.recordset[0];
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi tạo phiếu dự thi:', error);
            throw error;
        } finally {
            sql.close();
        }
    }

    /**
     * Cập nhật trạng thái phiếu dự thi
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @param {string} trangThai - Trạng thái mới
     * @returns {Object} Kết quả cập nhật
     */
    static async capNhatTrangThai(maPhieuDuThi, trangThai) {
        try {
            const pool = await poolPromise;
            
            await pool.request()
                .input('trangThai', sql.NVarChar, trangThai)
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(`
                    UPDATE PHIEUDUTHI
                    SET TRANGTHAI = @trangThai
                    WHERE MAPHIEUDUTHI = @maPhieuDuThi
                `);
            
            return { success: true };
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi cập nhật trạng thái phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Gửi email thông báo
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Kết quả gửi email
     */
    static async guiThongBaoEmail(maPhieuDuThi) {
        try {
            // Lấy thông tin thí sinh
            console.log(`Bắt đầu gửi email cho phiếu dự thi: ${maPhieuDuThi}`);
            const phieuDuThi = await this.timPhieuDuThiTheoMa(maPhieuDuThi);
            
            if (!phieuDuThi) {
                throw new Error(`Không tìm thấy phiếu dự thi ${maPhieuDuThi}`);
            }
            
            console.log('Thông tin phiếu dự thi:', JSON.stringify(phieuDuThi, null, 2));
            
            const { EMAIL, TENTHISINH, SBD, NGAYPHATHANH, NGAYTHI, GIOTHI_STR, TENPHONG, VITRIPHONG } = phieuDuThi;
            
            if (!EMAIL) {
                throw new Error(`Thí sinh không có địa chỉ email`);
            }
            
            console.log(`Chuẩn bị gửi email đến: ${EMAIL}`);
            
            // Định dạng ngày thi và giờ thi
            const ngayThiFormatted = NGAYTHI ? new Date(NGAYTHI).toLocaleDateString('vi-VN') : 'Chưa xác định';
            // Sử dụng chuỗi giờ thi đã được định dạng từ SQL Server
            const gioThiFormatted = GIOTHI_STR || 'Chưa xác định';
            
            const tenPhongFormatted = TENPHONG || 'Chưa xác định';
            const vitriPhongFormatted = VITRIPHONG || 'Chưa xác định';
            
            // Cấu hình nội dung email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: EMAIL,
                subject: 'Thông báo phiếu dự thi',
                html: `
                    <h2>Thông báo phiếu dự thi</h2>
                    <p>Kính gửi ${TENTHISINH},</p>
                    <p>Trung tâm Ngoại ngữ và Tin học ACCI xin thông báo phiếu dự thi của bạn đã được phát hành.</p>
                    <p><strong>Thông tin phiếu dự thi:</strong></p>
                    <ul>
                        <li>Mã phiếu dự thi: ${maPhieuDuThi}</li>
                        <li>Số báo danh: ${SBD}</li>
                        <li>Ngày phát hành: ${NGAYPHATHANH ? new Date(NGAYPHATHANH).toLocaleDateString('vi-VN') : 'Chưa xác định'}</li>
                    </ul>
                    <p><strong>Thông tin kỳ thi:</strong></p>
                    <ul>
                        <li>Ngày thi: ${ngayThiFormatted}</li>
                        <li>Giờ thi: ${gioThiFormatted}</li>
                        <li>Phòng thi: ${tenPhongFormatted}</li>
                        <li>Vị trí phòng: ${vitriPhongFormatted}</li>
                    </ul>
                    <p>Vui lòng mang theo giấy tờ tùy thân khi tham gia kỳ thi.</p>
                    <p>Trân trọng,</p>
                    <p>Trung tâm ngoại ngữ</p>
                `
            };
            
            console.log('Mail options:', JSON.stringify(mailOptions, null, 2));
            console.log('Thông tin người gửi:', process.env.EMAIL_USER);
            
            // Gửi email
            try {
                await transporter.sendMail(mailOptions);
                console.log('Email đã được gửi thành công');
            } catch (emailError) {
                console.error('Lỗi khi gửi email:', emailError);
                throw new Error(`Lỗi gửi email: ${emailError.message}`);
            }
            
            // Cập nhật trạng thái phiếu dự thi
            await this.capNhatTrangThai(maPhieuDuThi, 'Đã gửi');
            
            console.log(`Đã gửi email thông báo cho phiếu dự thi ${maPhieuDuThi} đến ${EMAIL}`);
            
            return { success: true, message: `Đã gửi email thông báo đến ${EMAIL}` };
        } catch (error) {
            console.error('Lỗi chi tiết:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Tìm phiếu dự thi theo mã
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Thông tin phiếu dự thi
     */
    static async timPhieuDuThiTheoMa(maPhieuDuThi) {
        try {
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(`
                    SELECT 
                        p.MAPHIEUDUTHI,
                        p.SBD,
                        p.TRANGTHAI,
                        p.NGAYPHATHANH,
                        p.MANHANVIEN,
                        p.MAPHIEUDANGKY,
                        p.MATHISINH,
                        t.TENTHISINH,
                        t.EMAIL,
                        l.NGAYTHI,
                        CONVERT(VARCHAR(8), l.GIOTHI, 108) AS GIOTHI_STR,
                        ph.TENPHONG,
                        ph.VITRIPHONG
                    FROM PHIEUDUTHI p
                    JOIN THISINH t ON p.MATHISINH = t.MATHISINH
                    JOIN LICHTHI l ON t.MALICHTHI = l.MALICHTHI
                    JOIN PHONGTHI ph ON l.MAPHONG = ph.MAPHONG
                    WHERE p.MAPHIEUDUTHI = @maPhieuDuThi
                `);
            
            if (result.recordset.length > 0) {
                return result.recordset[0];
            }
            
            return null;
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi tìm phiếu dự thi:', error);
            throw error;
        }
    }

    /**
     * Kiểm tra trạng thái hiện tại của phiếu dự thi
     * @param {string} maPhieuDuThi - Mã phiếu dự thi
     * @returns {Object} Thông tin về trạng thái phiếu
     */
    static async kiemTraTrangThai(maPhieuDuThi) {
        try {
            const pool = await poolPromise;
            const checkQuery = `
                SELECT TRANGTHAI FROM PHIEUDUTHI 
                WHERE MAPHIEUDUTHI = @maPhieuDuThi
            `;
            
            const result = await pool.request()
                .input('maPhieuDuThi', sql.NVarChar, maPhieuDuThi)
                .query(checkQuery);
                
            if (result.recordset.length > 0) {
                return {
                    found: true,
                    status: result.recordset[0].TRANGTHAI
                };
            } else {
                return { found: false };
            }
        } catch (error) {
            console.error('Lỗi cơ sở dữ liệu khi kiểm tra trạng thái phiếu dự thi:', error);
            throw error;
        }
    }
}

module.exports = PhieuDuThiDAO;
