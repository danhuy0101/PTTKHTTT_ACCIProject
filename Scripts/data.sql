
USE TTNNDB
GO

INSERT INTO TAIKHOAN (USERNAME, [PASSWORD], [ROLE]) VALUES
(N'user1', N'password1', N'Tiếp nhận'),
(N'user2', N'password2', N'Coi thi'),
(N'user3', N'password3', N'Kế toán'),
(N'user4', N'password4', N'Phát hành'),
(N'user5', N'password5', N'Nhập liệu'),
(N'user6', N'password6', N'Coi thi'),
(N'user7', N'password7', N'Kế toán'),
(N'user8', N'password8', N'Phát hành'),
(N'user9', N'password9', N'Nhập liệu'),
(N'user10', N'password10', N'Tiếp nhận');

GO

INSERT INTO NHANVIEN (MANHANVIEN, TENNHANVIEN, NGAYSINH, DIACHI, SĐT, EMAIL, VAITRO) VALUES
('NV0000001', N'Trần Đan Huy', '1985-05-12', N'123 Lê Lợi, Hà Nội', '0912345678', 'nva@example.com', N'Tiếp nhận'),
('NV0000002', N'Đỗ Hải Yến', '1990-07-23', N'456 Nguyễn Trãi, TP HCM', '0923456789', 'ttb@example.com', N'Coi thi'),
('NV0000003', N'Lâm Tiến Huy', '1988-11-30', N'789 Hai Bà Trưng, Đà Nẵng', '0934567890', 'pvc@example.com', N'Kế toán'),
('NV0000004', N'Lê Phương Giang', '1992-03-15', N'321 Trần Hưng Đạo, Hải Phòng', '0945678901', 'ltd@example.com', N'Phát hành'),
('NV0000005', N'Nguyễn Bình Minh', '1987-09-10', N'654 Lý Thường Kiệt, Cần Thơ', '0956789012', 'hve@example.com', N'Nhập liệu'),
('NV0000006', N'Võ Như Quỳnh', '1995-12-05', N'987 Quang Trung, Đà Lạt', '0967890123', 'dtf@example.com', N'Tiếp nhận'),
('NV0000007', N'Đỗ Quốc Việt', '1993-08-19', N'741 Nguyễn Huệ, Vinh', '0978901234', 'bvg@example.com', N'Coi thi'),
('NV0000008', N'Nguyễn Trần Khánh Liên', '1991-06-25', N'852 Trần Quang Khải, Nha Trang', '0989012345', 'nth@example.com', N'Kế toán'),
('NV0000009', N'Trần Bảo Dương', '1986-04-17', N'369 Hoàng Hoa Thám, Huế', '0990123456', 'vvi@example.com', N'Phát hành'),
('NV0000010', N'Lê Trần Ngân Tâm', '1994-02-28', N'258 Lạc Long Quân, Quy Nhơn', '0901234567', 'dtk@example.com', N'Nhập liệu');

GO
INSERT INTO CHUNGMINHGIAHAN (MAPHIEUCM, THOIDIEMGIAHAN, LYDOGIAHAN)
VALUES
('CM00000001', '2024-03-15 08:30:00', N'Lý do sức khỏe'),
('CM00000002', '2024-04-01 14:45:00', N'Hoàn cảnh gia đình khó khăn'),
('CM00000003', '2024-04-10 09:15:00', N'Lịch trình công tác thay đổi'),
('CM00000004', '2024-05-05 16:00:00', N'Lỗi hệ thống đăng ký'),
('CM00000005', '2024-05-20 10:30:00', N'Yêu cầu từ khách hàng doanh nghiệp'),
('CM00000006', '2024-06-02 13:20:00', N'Lý do cá nhân'),
('CM00000007', '2024-06-15 11:10:00', N'Khách hàng cung cấp thiếu giấy tờ'),
('CM00000008', '2024-07-01 15:45:00', N'Vướng mắc hợp đồng liên quan'),
('CM00000009', '2024-07-10 08:00:00', N'Khách hàng nhầm lẫn thông tin đăng ký'),
('CM00000010', '2024-07-25 17:30:00', N'Lý do phát sinh từ đối tác cung cấp dịch vụ');

GO
INSERT INTO DONVICHAMTHI (MADONVI, TENDONVI, DIACHI, SĐT, EMAIL)
VALUES
('DV00000001', N'Đơn Vị A', N'Địa chỉ 1, Hà Nội', '0123456789', 'donvia@example.com'),
('DV00000002', N'Đơn Vị B', N'Địa chỉ 2, TP.HCM', '0987654321', 'donvib@example.com'),
('DV00000003', N'Đơn Vị C', N'Địa chỉ 3, Đà Nẵng', '0934123456', 'donvic@example.com'),
('DV00000004', N'Đơn Vị D', N'Địa chỉ 4, Huế', '0945123456', 'donvid@example.com'),
('DV00000005', N'Đơn Vị E', N'Địa chỉ 5, Cần Thơ', '0976123456', 'donvie@example.com'),
('DV00000006', N'Đơn Vị F', N'Địa chỉ 6, Hải Phòng', '0915123456', 'donvif@example.com'),
('DV00000007', N'Đơn Vị G', N'Địa chỉ 7, Quảng Ninh', '0905123456', 'donvig@example.com'),
('DV00000008', N'Đơn Vị H', N'Địa chỉ 8, Bắc Giang', '0925123456', 'donvih@example.com'),
('DV00000009', N'Đơn Vị I', N'Địa chỉ 9, Nghệ An', '0935123456', 'donvii@example.com'),
('DV00000010', N'Đơn Vị J', N'Địa chỉ 10, Quảng Nam', '0945123456', 'donvij@example.com');

GO
INSERT INTO LINHVUC (MALINHVUC, TENLINHVUC)
VALUES
('LV00000001', N'Ngoại ngữ'),
('LV00000002', N'Tin học');

GO
INSERT INTO PHONGTHI (MAPHONG, TENPHONG, VITRIPHONG)
VALUES 
('PT0000001', N'Phòng Thi 1', N'Tầng 1, Khu A'),
('PT0000002', N'Phòng Thi 2', N'Tầng 1, Khu A'),
('PT0000003', N'Phòng Thi 3', N'Tầng 2, Khu B'),
('PT0000004', N'Phòng Thi 4', N'Tầng 2, Khu B'),
('PT0000005', N'Phòng Thi 5', N'Tầng 3, Khu C'),
('PT0000006', N'Phòng Thi 6', N'Tầng 3, Khu C'),
('PT0000007', N'Phòng Thi 7', N'Tầng 4, Khu D'),
('PT0000008', N'Phòng Thi 8', N'Tầng 4, Khu D'),
('PT0000009', N'Phòng Thi 9', N'Tầng 5, Khu E'),
('PT0000010', N'Phòng Thi 10', N'Tầng 5, Khu E');

GO
INSERT INTO LOAIDANHGIANANGLUC (MADANHGIA, TENDANHGIA, CAPDO, MALINHVUC, GIAHIENTAI)
VALUES
-- Các chứng chỉ ngoại ngữ
('DG00000001', N'IELTS', N'1.0 - 9.0', 'LV00000001', 4500000),
('DG00000002', N'TOEIC', N'10 - 990', 'LV00000001', 1200000),
('DG00000003', N'TOEFL iBT', N'0 - 120', 'LV00000001', 4800000),
('DG00000004', N'Cambridge C1 Advanced', N'C1', 'LV00000001', 3500000),
('DG00000005', N'DELF', N'A1 - C2', 'LV00000001', 2800000),

-- Các chứng chỉ tin học
('DG00000006', N'MOS', N'Excel, Word, PowerPoint', 'LV00000002', 1500000),
('DG00000007', N'IC3', N'GS4, GS5', 'LV00000002', 1800000),
('DG00000008', N'CEH (Certified Ethical Hacker)', N'Chuyên gia bảo mật', 'LV00000002', 18000000),
('DG00000009', N'CompTIA Security+', N'Bảo mật hệ thống', 'LV00000002', 9500000),
('DG00000010', N'CCNA', N'Mạng máy tính', 'LV00000002', 7000000);

GO
INSERT INTO KHACHHANG (MAKHACHHANG, TENKHACHHANG, NGAYSINH, DIACHI, SĐT, EMAIL, LOAIKHACHHANG)
VALUES
('KH00000001', N'Trần Minh Sang', '1990-05-15', N'123 Đường ABC, Hà Nội', '0123456789', 'tms@example.com', N'Tự do'),
('KH00000002', N'Công ty TNHH Xây dựng Thành Đạt', NULL, N'456 Đường DEF, TP.HCM', '0987654321', 'contact@thanhdatxaydung.com', N'Đơn vị'),
('KH00000003', N'Tập đoàn Công nghệ FutureTech', NULL, N'789 Đường GHI, Đà Nẵng', '0912345678', 'info@futuretech.com', N'Đơn vị'),
('KH00000004', N'Trung tâm Dịch vụ Y tế Hòa Bình', NULL, N'321 Đường JKL, Cần Thơ', '0967890123', 'hoabinhmed@health.com', N'Đơn vị'),
('KH00000005', N'Đỗ Bảo Quỳnh', '1995-10-20', N'555 Đường MNO, Hải Phòng', '0971122334', 'dbq@example.com', N'Tự do'),
('KH00000006', N'Công ty Bảo hiểm An Phát', NULL, N'654 Đường PQR, Huế', '0944556677', 'support@anphatinsurance.com', N'Đơn vị'),
('KH00000007', N'Trần Châu Thúy Vy', '2000-07-07', N'987 Đường STU, Nha Trang', '0988112233', 'thuyvy@example.com', N'Tự do'),
('KH00000008', N'Trung tâm Giải trí Galaxy', NULL, N'222 Đường VWX, Bình Dương', '0922334455', 'contact@galaxyentertainment.com', N'Đơn vị'),
('KH00000009', N'Nguyễn Kim Quyên', '1988-02-28', N'111 Đường YZ, Đà Lạt', '0909777888', 'kimquyen@example.com', N'Tự do'),
('KH00000010', N'Công ty Du lịch Bốn Mùa', NULL, N'888 Đường ABC, Hải Dương', '0977445566', 'info@bonmuatravel.com', N'Đơn vị');

GO
INSERT INTO LICHTHI (MALICHTHI, NGAYTHI, GIOTHI, SOLUONGTOIDA, TRANGTHAI, MAPHONG, MADANHGIA, MADONVI)
VALUES
('LT00000001', '2025-05-10', '08:00:00', 30, N'Chưa thi', 'PT0000001', 'DG00000001', 'DV00000001'),
('LT00000002', '2025-05-15', '13:30:00', 25, N'Chưa thi', 'PT0000002', 'DG00000002', 'DV00000002'),
('LT00000003', '2025-05-20', '09:00:00', 40, N'Chưa thi', 'PT0000003', 'DG00000003', 'DV00000003'),
('LT00000004', '2025-04-28', '14:00:00', 20, N'Đã thi', 'PT0000004', 'DG00000004', 'DV00000004'),
('LT00000005', '2025-04-30', '10:30:00', 35, N'Đã thi', 'PT0000005', 'DG00000005', 'DV00000005'),
('LT00000006', '2025-05-05', '15:00:00', 50, N'Chưa thi', 'PT0000006', 'DG00000006', 'DV00000006'),
('LT00000007', '2025-03-20', '08:30:00', 30, N'Đã huỷ', 'PT0000007', 'DG00000007', 'DV00000007'),
('LT00000008', '2025-05-12', '10:00:00', 45, N'Chưa thi', 'PT0000008', 'DG00000008', 'DV00000008'),
('LT00000009', '2025-06-01', '14:30:00', 60, N'Chưa thi', 'PT0000009', 'DG00000009', 'DV00000009'),
('LT00000010', '2025-06-10', '09:30:00', 40, N'Chưa thi', 'PT0000010', 'DG00000010', 'DV00000010');

GO
INSERT INTO PHIEUDANGKY (MAPHIEUDANGKY, NGAYDANGKY, MAKHACHHANG, MALICHTHI, MANHANVIEN)
VALUES
('PDK0000001', '2025-03-28 09:30:00', 'KH0000001', 'LT00000001', 'NV0000001'),
('PDK0000002', '2025-03-38 10:15:00', 'KH0000002', 'LT00000002', 'NV0000002'),
('PDK0000003', '2025-03-28 14:45:00', 'KH0000003', 'LT00000003', 'NV0000003'),
('PDK0000004', '2025-03-28 08:20:00', 'KH0000004', 'LT00000004', 'NV0000004'),
('PDK0000005', '2025-04-05 11:10:00', 'KH0000005', 'LT00000005', 'NV0000005'),
('PDK0000006', '2025-04-06 13:30:00', 'KH0000006', 'LT00000006', 'NV0000006'),
('PDK0000007', '2025-04-07 15:00:00', 'KH0000007', 'LT00000007', 'NV0000007'),
('PDK0000008', '2025-04-08 09:45:00', 'KH0000008', 'LT00000008', 'NV0000008'),
('PDK0000009', '2025-04-09 16:20:00', 'KH0000009', 'LT00000009', 'NV0000009'),
('PDK0000010', '2025-04-10 07:55:00', 'KH0000010', 'LT00000010', 'NV0000010');

GO
INSERT INTO PHIEUGIAHAN (MAPHIEUGIAHAN, PHIGIAHAN, MADANGKY, MANHANVIEN, TRUONGHOPGIAHAN)
VALUES
('PGH0000001', 50000, 'PDK0000001', 'NV0000003', N'Lý do cá nhân'),
('PGH0000002', 50000, 'PDK0000002', 'NV0000003', N'Sai thông tin hồ sơ'),
('PGH0000003', 50000, 'PDK0000003', 'NV0000003', N'Lịch thi thay đổi'),
('PGH0000004', 50000, 'PDK0000004', 'NV0000003', N'Bệnh đột xuất'),
('PGH0000005', 50000, 'PDK0000005', 'NV0000003', N'Lý do công tác'),
('PGH0000006', 50000, 'PDK0000006', 'NV0000008', N'Chưa kịp chuẩn bị hồ sơ'),
('PGH0000007', 50000, 'PDK0000007', 'NV0000008', N'Lý do sức khỏe'),
('PGH0000008', 50000, 'PDK0000008', 'NV0000008', N'Bận việc cá nhân'),
('PGH0000009', 50000, 'PDK0000009', 'NV0000008', N'Chuyển công tác'),
('PGH0000010', 50000, 'PDK0000010', 'NV0000008', N'Thay đổi nguyện vọng');

GO
INSERT INTO CHUNGMINHGIAHAN (MAPHIEUCM, THOIDIEMGIAHAN, LYDOGIAHAN)
VALUES
('PGH0000001', '2025-04-02 10:00:00', N'Xác nhận có việc cá nhân đột xuất'),
('PGH0000002', '2025-04-03 15:30:00', N'Bổ sung giấy tờ chứng minh thông tin sai sót'),
('PGH0000003', '2025-04-04 08:45:00', N'Xác nhận từ hội đồng thi về lịch thi mới'),
('PGH0000004', '2025-04-05 11:20:00', N'Giấy khám bệnh chứng nhận tình trạng sức khỏe'),
('PGH0000005', '2025-04-06 13:50:00', N'Công lệnh điều động từ cơ quan công tác'),
('PGH0000006', '2025-04-07 16:10:00', N'Đơn xác nhận chưa kịp hoàn thành hồ sơ đúng hạn'),
('PGH0000007', '2025-04-08 09:30:00', N'Giấy khám sức khỏe chứng minh không thể dự thi'),
('PGH0000008', '2025-04-09 14:00:00', N'Giấy xác nhận bận công việc gia đình quan trọng'),
('PGH0000009', '2025-04-10 17:25:00', N'Quyết định điều động công tác từ cấp trên'),
('PGH0000010', '2025-04-11 12:40:00', N'Đơn đề nghị thay đổi nguyện vọng có chữ ký xác nhận');

GO
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(10001, N'Trần Minh Sang', '1990-05-15', N'123 Đường ABC, Hà Nội', '0123456789', 'tms@example.com', 'PDK0000001'),
(10002, N'Đỗ Bảo Quỳnh', '1995-10-20', N'555 Đường MNO, Hải Phòng', '0971122334', 'dbq@example.com', 'PDK0000002'),
(10003, N'Trần Châu Thúy Vy', '2000-07-07', N'987 Đường STU, Nha Trang', '0988112233', 'thuyvy@example.com', 'PDK0000003'),
(10004, N'Nguyễn Kim Quyên', '1988-02-28', N'111 Đường YZ, Đà Lạt', '0909777888', 'kimquyen@example.com', 'PDK0000004');

-- Công ty TNHH Xây dựng Thành Đạt 
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20001, N'Nguyễn Trung Hiếu', '1997-06-21', N'456 Đường DEF, TP.HCM', '0987123456', 'nth@thanhdat.com', 'PDK0000005'),
(20002, N'Nguyễn Hoàng Nhật Huy', '1996-09-15', N'456 Đường DEF, TP.HCM', '0968112233', 'nhnh@thanhdat.com', 'PDK0000005'),
(20003, N'Huỳnh Ngọc Xuân Nhi', '1998-11-10', N'456 Đường DEF, TP.HCM', '0947123456', 'xuannhi@thanhdat.com', 'PDK0000005');

-- Tập đoàn Công nghệ FutureTech 
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20004, N'Phạm Quang Dũng', '1995-03-25', N'789 Đường GHI, Đà Nẵng', '0933112233', 'phamquangd@futuretech.com', 'PDK0000006'),
(20005, N'Võ Lê Quế Anh', '1994-07-30', N'789 Đường GHI, Đà Nẵng', '0922113344', 'anhque@futuretech.com', 'PDK0000006');

-- Trung tâm Dịch vụ Y tế Hòa Bình 
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20006, N'Vũ Văn Hộ', '1993-05-12', N'321 Đường JKL, Cần Thơ', '0911223344', 'vuvanF@hoabinhmed.com', 'PDK0000007'),
(20007, N'Trịnh Kim Chi', '1992-10-22', N'321 Đường JKL, Cần Thơ', '0902334455', 'trinhchig@hoabinhmed.com', 'PDK0000007');

-- Công ty Bảo hiểm An Phát 
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20008, N'Tô Hoàng Quân', '1991-12-05', N'654 Đường PQR, Huế', '0977445566', 'tohoangh@anphatinsurance.com', 'PDK0000008'),
(20009, N'Đặng Quỳnh Thi', '1990-04-18', N'654 Đường PQR, Huế', '0955667788', 'dangquynhi@anphatinsurance.com', 'PDK0000008'),
(20010, N'Nguyễn Hải Dương', '1989-08-27', N'654 Đường PQR, Huế', '0944556677', 'nguyenhaiduong@anphatinsurance.com', 'PDK0000008');

-- Trung tâm Giải trí Galaxy
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20011, N'Huỳnh Thị Bé Nhỏ', '1999-01-10', N'222 Đường VWX, Bình Dương', '0988776655', 'benho@galaxy.com', 'PDK0000009'),
(20012, N'Nguyễn Thị Lệ Nam Em', '2001-06-15', N'222 Đường VWX, Bình Dương', '0977665544', 'namem@galaxy.com', 'PDK0000009');

-- Công ty Du lịch Bốn Mùa 
INSERT INTO THISINH (MATHISINH, TENTHISINH, NGAYSINH, DIACHI, SĐT, EMAIL, MAPHIEUDANGKY)
VALUES
(20013, N'Trần Thị Hương Thảo', '1995-09-23', N'888 Đường ABC, Hải Dương', '0966554433', 'thaothun@bonmuatravel.com', 'PDK0000010'),
(20014, N'Hồ Ngọc Hà', '1996-02-28', N'888 Đường ABC, Hải Dương', '0955443322', 'haho@bonmuatravel.com', 'PDK0000010');

GO
INSERT INTO PHANCONG (MALICHTHI, MANHANVIEN)
VALUES
('LT00000001', 'NV0000002'),
('LT00000001', 'NV0000007'),
('LT00000002', 'NV0000002'),
('LT00000002', 'NV0000007'),
('LT00000003', 'NV0000002'),
('LT00000004', 'NV0000007'),
('LT00000005', 'NV0000002'),
('LT00000005', 'NV0000007'),
('LT00000006', 'NV0000002'),
('LT00000007', 'NV0000007'),
('LT00000008', 'NV0000002'),
('LT00000008', 'NV0000007'),
('LT00000009', 'NV0000002'),
('LT00000009', 'NV0000007'),
('LT00000010', 'NV0000002');

GO
INSERT INTO PHIEUDUTHI (MAPHIEUDUTHI, SBD, TRANGTHAI, NGAYPHATHANH, MANHANVIEN, MAPHIEUDANGKY, MATHISINH)
VALUES
('PDT0000001', 'SBD001', N'Chưa thi', '2025-04-01', 'NV0000004', 'PDK0000001', 10001),
('PDT0000002', 'SBD002', N'Chưa thi', '2025-04-01', 'NV0000004', 'PDK0000002', 10002),
('PDT0000003', 'SBD003', N'Chưa thi', '2025-04-01', 'NV0000004', 'PDK0000003', 10003),
('PDT0000004', 'SBD004', N'Chưa thi', '2025-04-01', 'NV0000004', 'PDK0000004', 10004),

('PDT0000005', 'SBD005', N'Chưa thi', '2025-04-05', 'NV0000009', 'PDK0000005', 20001),
('PDT0000006', 'SBD006', N'Chưa thi', '2025-04-05', 'NV0000009', 'PDK0000005', 20002),
('PDT0000007', 'SBD007', N'Chưa thi', '2025-04-05', 'NV0000009', 'PDK0000005', 20003),

('PDT0000008', 'SBD008', N'Chưa thi', '2025-04-06', 'NV0000009', 'PDK0000006', 20004),
('PDT0000009', 'SBD009', N'Chưa thi', '2025-04-06', 'NV0000009', 'PDK0000006', 20005),

('PDT0000010', 'SBD010', N'Chưa thi', '2025-04-07', 'NV0000009', 'PDK0000007', 20006),
('PDT0000011', 'SBD011', N'Chưa thi', '2025-04-07', 'NV0000009', 'PDK0000007', 20007),

('PDT0000012', 'SBD012', N'Chưa thi', '2025-04-08', 'NV0000004', 'PDK0000008', 20008),
('PDT0000013', 'SBD013', N'Chưa thi', '2025-04-08', 'NV0000004', 'PDK0000008', 20009),
('PDT0000014', 'SBD014', N'Chưa thi', '2025-04-08', 'NV0000004', 'PDK0000008', 20010),

('PDT0000015', 'SBD015', N'Chưa thi', '2025-04-09', 'NV0000009', 'PDK0000009', 20011),
('PDT0000016', 'SBD016', N'Chưa thi', '2025-04-09', 'NV0000009', 'PDK0000009', 20012),

('PDT0000017', 'SBD017', N'Chưa thi', '2025-04-10', 'NV0000009', 'PDK0000010', 20013),
('PDT0000018', 'SBD018', N'Chưa thi', '2025-04-10', 'NV0000009', 'PDK0000010', 20014);

GO
INSERT INTO CHUNGCHI (MACHUNGCHI, NGAYCAP, KETQUATHI, TRANGTHAI, MAPHIEUDUTHI, MAKHACHHANG, MANHANVIEN)
VALUES
('CC00000001', '2025-04-15', N'Đạt', N'Chưa nhận', 'PDT0000001', 'KH00000001', 'NV0000001'),
('CC00000002', '2025-04-15', N'Không đạt', N'Chưa nhận', 'PDT0000002', 'KH00000005', 'NV0000001'),
('CC00000003', '2025-04-16', N'Đạt', N'Đã nhận', 'PDT0000003', 'KH00000007', 'NV0000006'),
('CC00000004', '2025-04-16', N'Đạt', N'Chưa nhận', 'PDT0000004', 'KH00000009', 'NV0000006'),

('CC00000005', '2025-04-20', N'Không đạt', N'Chưa nhận', 'PDT0000005', 'KH00000002', 'NV0000001'),
('CC00000006', '2025-04-20', N'Đạt', N'Đã nhận', 'PDT0000006', 'KH00000002', 'NV0000001'),
('CC00000007', '2025-04-21', N'Đạt', N'Chưa nhận', 'PDT0000007', 'KH00000002', 'NV0000006'),

('CC00000008', '2025-04-22', N'Đạt', N'Chưa nhận', 'PDT0000008', 'KH00000003', 'NV0000001'),
('CC00000009', '2025-04-22', N'Không đạt', N'Chưa nhận', 'PDT0000009', 'KH00000003', 'NV0000006'),

('CC00000010', '2025-04-23', N'Đạt', N'Đã nhận', 'PDT0000010', 'KH00000004', 'NV0000001'),
('CC00000011', '2025-04-23', N'Đạt', N'Chưa nhận', 'PDT0000011', 'KH00000004', 'NV0000006'),

('CC00000012', '2025-04-24', N'Không đạt', N'Chưa nhận', 'PDT0000012', 'KH00000006', 'NV0000001'),
('CC00000013', '2025-04-24', N'Đạt', N'Đã nhận', 'PDT0000013', 'KH00000006', 'NV0000001'),
('CC00000014', '2025-04-24', N'Đạt', N'Chưa nhận', 'PDT0000014', 'KH00000006', 'NV0000006'),

('CC00000015', '2025-04-25', N'Đạt', N'Chưa nhận', 'PDT0000015', 'KH00000008', 'NV0000001'),
('CC00000016', '2025-04-25', N'Không đạt', N'Đã nhận', 'PDT0000016', 'KH00000008', 'NV0000006'),

('CC00000017', '2025-04-26', N'Đạt', N'Chưa nhận', 'PDT0000017', 'KH00000010', 'NV0000001'),
('CC00000018', '2025-04-26', N'Đạt', N'Đã nhận', 'PDT0000018', 'KH00000010', 'NV0000006');

GO
INSERT INTO UUDAI (MAUUDAI, DIEUKIEN, PHANTRAMKHUYENMAI)
VALUES
('UU00000001', 0, 10.0),  
('UU00000002', 20, 15.0); 

GO
INSERT INTO THANHTOANPHIEUGIAHAN (MAGIAHAN, TRANGTHAI, SOTIEN, NGAYTHANHTOAN, MAPHIEUGIAHAN)
VALUES
('MGH0000001', N'Đã thanh toán', 50000, '2025-04-01', 'PGH0000001'),
('MGH0000002', N'Chưa thanh toán', 50000, NULL, 'PGH0000002'),
('MGH0000003', N'Đã thanh toán', 50000, '2025-04-02', 'PGH0000003'),
('MGH0000004', N'Quá hạn', 50000, NULL, 'PGH0000004'),
('MGH0000005', N'Đã thanh toán', 50000, '2025-04-03', 'PGH0000005'),
('MGH0000006', N'Chưa thanh toán', 50000, NULL, 'PGH0000006'),
('MGH0000007', N'Đã thanh toán', 50000, '2025-04-04', 'PGH0000007'),
('MGH0000008', N'Quá hạn', 50000, NULL, 'PGH0000008'),
('MGH0000009', N'Đã thanh toán', 50000, '2025-04-05', 'PGH0000009'),
('MGH0000010', N'Chưa thanh toán', 50000, NULL, 'PGH0000010');

GO