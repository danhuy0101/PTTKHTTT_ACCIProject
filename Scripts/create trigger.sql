﻿
USE TTNNDB
GO

-- Trigger kiểm tra giá trị phải lớn hơn 0
CREATE TRIGGER trg_CheckValues
ON HOADON
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE THANHTIEN <= 0)
    BEGIN
        RAISERROR (N'Giá trị THANHTIEN phải lớn hơn 0.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

CREATE TRIGGER trg_CheckSoTien_GiaoDich
ON GIAODICHCHUYENKHOAN
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE SOTIEN <= 0)
    BEGIN
        RAISERROR (N'Giá trị SOTIEN trong GIAODICHCHUYENKHOAN phải lớn hơn 0.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

-- Trigger kiểm tra SOTIEN trong THANHTOANHOADON
CREATE TRIGGER trg_CheckSoTien_ThanhToanHoaDon
ON THANHTOANHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE SOTIEN <= 0)
    BEGIN
        RAISERROR (N'Giá trị SOTIEN trong THANHTOANHOADON phải lớn hơn 0.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

-- Trigger kiểm tra SOTIEN trong THANHTOANPHIEUGIAHAN
CREATE TRIGGER trg_CheckSoTien_ThanhToanPhieuGiaHan
ON THANHTOANPHIEUGIAHAN
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE SOTIEN <= 0)
    BEGIN
        RAISERROR (N'Giá trị SOTIEN trong THANHTOANPHIEUGIAHAN phải lớn hơn 0.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

CREATE TRIGGER trg_CheckPhanTramKhuyenMai
ON UUDAI
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE PHANTRAMKHUYENMAI <= 0)
    BEGIN
        RAISERROR (N'Phần trăm khuyến mãi phải lớn hơn 0.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

--Thời gian đăng ký thi phải trước ngày thi ít nhất 7 ngày
CREATE TRIGGER trg_CheckRegistrationDate
ON PHIEUDANGKY
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN LICHTHI l ON i.MALICHTHI = l.MALICHTHI
        WHERE DATEDIFF(DAY, i.NGAYDANGKY, l.NGAYTHI) < 7
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Số lần gia hạn tối đa là 2 lần cho một phiếu đăng ký
CREATE TRIGGER trg_CheckRenewalLimit
ON PHIEUGIAHAN
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT MADANGKY
        FROM PHIEUGIAHAN
        GROUP BY MADANGKY
        HAVING COUNT(*) > 2
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Thời điểm gia hạn phải lớn hơn giờ thi trong lịch thi là 24 tiếng.
CREATE TRIGGER trg_CheckRenewalTime
ON PHIEUGIAHAN
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN PHIEUDANGKY pd ON i.MADANGKY = pd.MAPHIEUDANGKY
        JOIN LICHTHI lt ON pd.MALICHTHI = lt.MALICHTHI
        WHERE i.PHIGIAHAN IS NOT NULL
          AND i.MAPHIEUGIAHAN IS NOT NULL
          AND DATEDIFF(HOUR, lt.NGAYTHI, GETDATE()) < 24
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Luôn giảm giá 10% cho khách hàng đơn vị và khách hàng đơn vị có trên 20 thí sinh sẽ được giảm 15%
CREATE TRIGGER trg_DiscountForCompany
ON HOADON
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE H
    SET THANHTIEN = 
        CASE 
            WHEN (SELECT COUNT(*) 
                  FROM PHIEUDANGKY P 
                  WHERE P.MAKHACHHANG = (SELECT MAKHACHHANG FROM PHIEUDANGKY WHERE MAPHIEUDANGKY = H.MAPHIEUDANGKY)
                 ) >= 20 
            THEN H.THANHTIEN * 0.85  
            ELSE H.THANHTIEN * 0.9   
        END
    FROM HOADON H
    JOIN INSERTED I ON H.MAHOADON = I.MAHOADON
    JOIN PHIEUDANGKY P ON H.MAPHIEUDANGKY = P.MAPHIEUDANGKY
    JOIN KHACHHANG K ON P.MAKHACHHANG = K.MAKHACHHANG
    WHERE K.LOAIKHACHHANG = N'Đơn vị' 
          AND H.THANHTIEN IS NOT NULL; 

END;
GO

--Ngày phát hành phiếu dự trong phiếu dự thi phải diễn ra sau ngày đăng ký trong phiếu đăng ký.
CREATE TRIGGER TRG_Check_NgayPhatHanh
ON PHIEUDUTHI
FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN PHIEUDANGKY pdk ON i.MAPHIEUDANGKY = pdk.MAPHIEUDANGKY
        WHERE i.NGAYPHATHANH <= pdk.NGAYDANGKY
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Ngày thi trong lịch thi phải sau hoặc bằng ngày phát hành phiếu dự thi.
CREATE TRIGGER TRG_Check_NgayThi
ON LICHTHI
FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN PHIEUDUTHI pdt ON i.MALICHTHI = pdt.MAPHIEUDANGKY
        WHERE i.NGAYTHI < pdt.NGAYPHATHANH
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;

GO

--Hóa đơn phải được thanh toán trong vòng 3 ngày kể từ ngày đăng ký.
CREATE TRIGGER TRG_Check_HoaDon_ThanhToan
ON THANHTOANHOADON
FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN HOADON hd ON i.MAHOADON = hd.MAHOADON
        WHERE i.NGAYTHANHTOAN > DATEADD(DAY, 3, hd.NGAYLAP)
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Ngày thanh toán phải sao ngày lập hóa đơn
CREATE TRIGGER TRG_Check_HoaDon_NgayThanhToan
ON THANHTOANHOADON
FOR INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN HOADON hd ON i.MAHOADON = hd.MAHOADON
        WHERE i.NGAYTHANHTOAN < hd.NGAYLAP
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;

GO
--Số lượng thí sinh dự thi không được quá số lượng tối đa của lịch thi đó.
CREATE TRIGGER TRG_Check_SoLuong_ThiSinh
ON PHIEUDANGKY
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM PHIEUDANGKY pd
        JOIN LICHTHI lt ON pd.MALICHTHI = lt.MALICHTHI
        WHERE lt.SOLUONGTOIDA < (
            SELECT COUNT(*) 
            FROM PHIEUDANGKY 
            WHERE MALICHTHI = pd.MALICHTHI
        )
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Nhân viên nhập liệu chỉ có thể nhập điểm khi kì thi đã kết thúc
CREATE TRIGGER TRG_KiemTra_NhapDiem
ON PHIEUDUTHI
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted pd
        JOIN PHIEUDANGKY dk ON pd.MAPHIEUDANGKY = dk.MAPHIEUDANGKY
        JOIN LICHTHI lt ON dk.MALICHTHI = lt.MALICHTHI
        JOIN NHANVIEN nv ON pd.MANHANVIEN = nv.MANHANVIEN
        WHERE nv.VAITRO = N'Nhập liệu' AND lt.TRANGTHAI <> N'Đã thi'
    )
    BEGIN
        -- Hủy giao dịch nếu kỳ thi chưa kết thúc
        ROLLBACK TRANSACTION;
    END
END;
GO

--Khách hàng tự do chỉ có thể giao dịch bằng hình thức chuyển khoản
--Khách hàng đơn vị có thể thực hiện cả 2 hình thức
CREATE TRIGGER TRG_KiemTra_HinhThucThanhToan
ON THANHTOANHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN HOADON h ON i.MAHOADON = h.MAHOADON
        JOIN PHIEUDANGKY pd ON h.MAPHIEUDANGKY = pd.MAPHIEUDANGKY
        JOIN KHACHHANG k ON pd.MAKHACHHANG = k.MAKHACHHANG
        WHERE k.LOAIKHACHHANG = N'Tự do' 
          AND NOT EXISTS (SELECT 1 FROM GIAODICHCHUYENKHOAN g WHERE g.MATHANHTOAN = i.MATHANHTOAN)
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO


--Trạng thái thanh toán chỉ cập nhật “Thành công”  khi tổng tiền đã được thanh toán đủ.
CREATE TRIGGER TRG_CapNhat_TrangThaiThanhToan
ON THANHTOANHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE THANHTOANHOADON
    SET TRANGTHAI = 
        CASE 
            WHEN (SELECT SUM(SOTIEN) 
                  FROM THANHTOANHOADON 
                  WHERE MAHOADON = t.MAHOADON) 
                 >= (SELECT THANHTIEN FROM HOADON WHERE MAHOADON = t.MAHOADON)
            THEN N'Đã thanh toán'
            ELSE N'Chưa thanh toán'
        END
    FROM THANHTOANHOADON t
    JOIN inserted i ON t.MATHANHTOAN = i.MATHANHTOAN;
END;
GO

--Không thể đăng ký 2 kỳ thi trùng lịch của cùng một loại chứng chỉ.
CREATE TRIGGER TRG_KiemTraTrungLichThi
ON PHIEUDANGKY
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN LICHTHI lt1 ON i.MALICHTHI = lt1.MALICHTHI
        JOIN LOAIDANHGIANANGLUC ld ON lt1.MADANHGIA = ld.MADANHGIA
        JOIN PHIEUDANGKY pd ON i.MAKHACHHANG = pd.MAKHACHHANG
        JOIN LICHTHI lt2 ON pd.MALICHTHI = lt2.MALICHTHI
        WHERE 
            lt1.NGAYTHI = lt2.NGAYTHI  -- Trùng ngày thi
            AND lt1.GIOTHI = lt2.GIOTHI -- Trùng giờ thi
            AND ld.MADANHGIA = lt2.MADANHGIA -- Cùng loại chứng chỉ
            AND pd.MAPHIEUDANGKY <> i.MAPHIEUDANGKY -- Không kiểm tra với chính nó
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Nếu phiếu gia hạn có chứng minh gia hạn thì không thể có phiếu thanh toán gia hạn.
CREATE TRIGGER TRG_KIEMTRA_GIAHAN
ON THANHTOANPHIEUGIAHAN
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN CHUNGMINHGIAHAN cmg ON i.MAPHIEUGIAHAN = cmg.MAPHIEUCM
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Nếu phiếu gia hạn có phiếu thanh toán gia hạn thì không thể có chứng minh gia hạn
CREATE TRIGGER TRG_KIEMTRA_CHUNGMINH_GIAHAN
ON CHUNGMINHGIAHAN
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN THANHTOANPHIEUGIAHAN tp ON i.MAPHIEUCM = tp.MAPHIEUGIAHAN
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Phiếu đăng ký quá hạn thanh toán sẽ bị hủy 
CREATE TRIGGER TRG_XOA_PHIEU_DANG_KY_QUA_HAN
ON THANHTOANHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    DELETE FROM PHIEUDANGKY
    WHERE MAPHIEUDANGKY IN (
        SELECT h.MAPHIEUDANGKY
        FROM inserted i
        JOIN HOADON h ON i.MAHOADON = h.MAHOADON
        WHERE i.TRANGTHAI = N'Quá hạn'
    );
END;
GO


CREATE TRIGGER TRG_KIEM_TRA_GIA_HAN_TRUOC_GIO_THI
ON PHIEUGIAHAN
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN PHIEUDANGKY pd ON i.MADANGKY = pd.MAPHIEUDANGKY
        JOIN LICHTHI lt ON pd.MALICHTHI = lt.MALICHTHI
        WHERE DATEDIFF(HOUR, GETDATE(), lt.NGAYTHI) < 24
    )
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Ngày thi, ngày phát hành, ngày cấp, ngày lập và ngày thanh toán không được lớn hơn ngày hiện tại.
CREATE TRIGGER TRG_KIEM_TRA_NGAYTHI
ON LICHTHI
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE NGAYTHI > GETDATE())
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER TRG_KIEM_TRA_NGAYPHATHANH
ON PHIEUDUTHI
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE NGAYPHATHANH > GETDATE())
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER TRG_KIEM_TRA_NGAYCAP
ON CHUNGCHI
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE NGAYCAP > GETDATE())
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER TRG_KIEM_TRA_NGAYLAP
ON HOADON
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE NGAYLAP > GETDATE())
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER TRG_KIEM_TRA_NGAYTHANHTOAN_HOADON
ON THANHTOANHOADON
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE NGAYTHANHTOAN > GETDATE())
    BEGIN
        ROLLBACK TRANSACTION;
    END
END;
GO

--Kiểm tra xem khách hàng có đăng ký trùng lịch thi không?
CREATE TRIGGER TRG_KIEM_TRA_DANGKY_TRUNG_LICHTHI
ON PHIEUDANGKY
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN PHIEUDANGKY p ON i.MAKHACHHANG = p.MAKHACHHANG
        WHERE p.MALICHTHI <> i.MALICHTHI AND p.MAKHACHHANG = i.MAKHACHHANG
    )
    BEGIN
        ROLLBACK TRANSACTION;  
    END
END;
GO

