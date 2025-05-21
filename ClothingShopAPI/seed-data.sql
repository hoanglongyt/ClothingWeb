-- Xóa dữ liệu hiện có
DELETE FROM OrderItems;
DELETE FROM Orders;
DELETE FROM ProductColors;
DELETE FROM ProductSizes;
DELETE FROM Products;
DELETE FROM Users;

-- Thêm người dùng
INSERT INTO Users (Username, Email, PasswordHash, FullName, Address, Phone, CreatedAt, Role)
VALUES 
('admin', 'admin@example.com', '$2a$11$Uj7.ORNZXJOvXWqNOPgXAuXmD5yKPGsT3JOtSJzk02lKM6CYcBWFO', 'Admin User', '123 Admin St', '0987654321', GETDATE(), 'Admin'),
('customer', 'customer@example.com', '$2a$11$3O7.1fkqIBGpvvF4rV62WOJJJnvVFRFVpZuHdzLfRqGJQ.XZxRpS2', 'Customer User', '456 Customer St', '0123456789', GETDATE(), 'Customer');

-- Thêm sản phẩm
INSERT INTO Products (Name, Description, Price, ImageUrl, Category, InStock, StockQuantity, CreatedAt)
VALUES 
('Áo thun nam basic', 'Áo thun nam chất liệu cotton 100%, thoáng mát', 199000, '/assets/images/products/ao-thun-nam.jpg', 'Áo nam', 1, 100, GETDATE()),
('Quần jean nữ ống rộng', 'Quần jean nữ ống rộng, phong cách hiện đại', 450000, '/assets/images/products/quan-jean-nu.jpg', 'Quần nữ', 1, 50, GETDATE()),
('Áo sơ mi nam dài tay', 'Áo sơ mi nam dài tay, chất liệu lụa cao cấp', 350000, '/assets/images/products/ao-so-mi-nam.jpg', 'Áo nam', 1, 75, GETDATE()),
('Váy liền thân nữ', 'Váy liền thân nữ, thiết kế thanh lịch, phù hợp đi làm và dạo phố', 550000, '/assets/images/products/vay-lien-than.jpg', 'Váy nữ', 1, 30, GETDATE());

-- Thêm kích thước cho sản phẩm
INSERT INTO ProductSizes (ProductId, Size)
VALUES 
(1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'),
(2, 'S'), (2, 'M'), (2, 'L'),
(3, 'M'), (3, 'L'), (3, 'XL'), (3, 'XXL'),
(4, 'S'), (4, 'M'), (4, 'L');

-- Thêm màu sắc cho sản phẩm
INSERT INTO ProductColors (ProductId, Color)
VALUES 
(1, 'Đen'), (1, 'Trắng'), (1, 'Xám'),
(2, 'Xanh nhạt'), (2, 'Xanh đậm'),
(3, 'Trắng'), (3, 'Xanh nhạt'), (3, 'Đen'),
(4, 'Đen'), (4, 'Đỏ'), (4, 'Hồng');
