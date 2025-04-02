
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
('DG000001', N'Dánh Giá A', N'Cao', 'LV00000001', 900000),
('DG000002', N'Dánh Giá A', N'Trung Bình', 'LV00000001', 800000),
('DG000003', N'Dánh Giá A', N'Thấp', 'LV00000001', 600000),
('DG000004', N'Dánh Giá B', N'Cao', 'LV00000002', 850000),
('DG000005', N'Dánh Giá C', N'Trung Bình', 'LV00000001', 700000),
('DG000006', N'Dánh Giá D', N'Thấp', 'LV00000002', 500000);

GO

