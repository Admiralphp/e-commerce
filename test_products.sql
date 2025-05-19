-- Test products for the product-catalog database
INSERT INTO products (id, name, description, price, category, image_url, stock, created_at, updated_at)
VALUES 
  ('b5f8c25e-5b6d-4c26-9c03-cb8a1c69e4ce', 'Ultra Slim Phone Case', 'Sleek, lightweight protection for your phone.', 24.99, 'cases', 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg', 100, NOW(), NOW()),
  ('7d9bb38c-bc63-4b7a-a57e-a3c843f9977d', 'Fast Wireless Charger Pad', 'Charge your compatible devices quickly with this wireless charging pad.', 29.99, 'chargers', 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg', 50, NOW(), NOW()),
  ('12e8af41-2f9d-4e3a-b476-7ddc5ee16928', 'Premium Wireless Earbuds', 'Immerse yourself in rich, high-quality sound with these wireless earbuds.', 89.99, 'headphones', 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg', 25, NOW(), NOW()),
  ('f3d4a84c-0e7a-4d8c-9c5e-e5b3d7f8c1d2', 'Tempered Glass Screen Protector', 'Maximum protection against scratches and cracks for your phone screen.', 15.99, 'accessories', 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg', 200, NOW(), NOW()),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Phone Camera Lens Kit', 'Expand your phone photography with wide angle, macro, and fisheye lenses.', 49.99, 'accessories', 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg', 30, NOW(), NOW());
