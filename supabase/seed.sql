-- 插入测试用户数据
-- 注意：这些是测试数据，不包含真实的 user_id 引用

INSERT INTO customer (id, email, name, company_name, role, linkedin_url, admin) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', 'Admin User', 'Example Corp', 'Founder/Owner', 'https://linkedin.com/in/admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'user1@example.com', 'John Doe', 'Tech Startup', 'CEO', 'https://linkedin.com/in/johndoe', false),
('550e8400-e29b-41d4-a716-446655440003', 'user2@example.com', 'Jane Smith', 'Digital Agency', 'Manager', 'https://linkedin.com/in/janesmith', false),
('550e8400-e29b-41d4-a716-446655440004', 'user3@example.com', 'Bob Johnson', 'Consulting Firm', 'Employee', 'https://linkedin.com/in/bobjohnson', false),
('550e8400-e29b-41d4-a716-446655440005', 'user4@example.com', 'Alice Brown', 'Marketing Co', 'Other', 'https://linkedin.com/in/alicebrown', false)
ON CONFLICT (id) DO NOTHING;

-- 插入测试消息数据
INSERT INTO message (customer_id, message, status) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Hi John, I noticed your company is doing great work in the tech space. I would love to discuss potential collaboration opportunities.', 'draft'),
('550e8400-e29b-41d4-a716-446655440003', 'Hello Jane, I think there might be some interesting synergies between our companies. Would you be interested in a meeting?', 'approve'),
('550e8400-e29b-41d4-a716-446655440004', 'Hi Bob, I came across your profile and was impressed by your work. Let us connect and explore potential partnerships.', 'sent'),
('550e8400-e29b-41d4-a716-446655440005', 'Hello Alice, I believe our companies could benefit from working together. Would you be open to discussing this further?', 'draft')
ON CONFLICT DO NOTHING; 