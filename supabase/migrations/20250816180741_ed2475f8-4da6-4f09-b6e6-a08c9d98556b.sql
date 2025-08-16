-- Insert sample products for testing
INSERT INTO products (title, description, price, category, location, status, whatsapp_number, images, user_id) VALUES
('iPhone 13 Pro Max', 'Excellent condition iPhone 13 Pro Max, 256GB, comes with original box and charger. Used for 6 months only.', 75000, 'Electronics', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('MacBook Air M2', 'Brand new MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals.', 95000, 'Electronics', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Study Table with Chair', 'Wooden study table with comfortable chair. Perfect for dorm rooms. Excellent condition.', 3500, 'Furniture', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Engineering Textbooks Set', 'Complete set of engineering textbooks for Computer Science. All books in good condition.', 2500, 'Books', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Gaming Chair', 'Ergonomic gaming chair with lumbar support. Perfect for long study sessions or gaming.', 8500, 'Furniture', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Bluetooth Headphones', 'Sony WH-1000XM4 noise cancelling headphones. Great for studying and music.', 15000, 'Electronics', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Mini Refrigerator', 'Compact mini fridge perfect for dorm rooms. Energy efficient and in excellent condition.', 6500, 'Appliances', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Basketball', 'Official size basketball in great condition. Perfect for campus sports activities.', 1200, 'Sports', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Hostel Essentials Kit', 'Complete hostel essentials including bedsheets, pillow covers, towels, and basic toiletries.', 2800, 'Essentials', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1)),

('Scientific Calculator', 'Casio FX-991ES Plus scientific calculator. Essential for engineering and science students.', 800, 'Electronics', 'Mumbai, Maharashtra', 'active', '8639081837', '{"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500"}', (SELECT id FROM user_profiles WHERE email = 'abhinavpadige06@gmail.com' LIMIT 1));