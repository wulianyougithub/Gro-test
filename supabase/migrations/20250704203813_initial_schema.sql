-- 创建 customer 表
CREATE TABLE IF NOT EXISTS customer (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    company_name TEXT,
    role TEXT,
    linkedin_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 message 表
CREATE TABLE IF NOT EXISTS message (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customer(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approve', 'sent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- customer 表的 RLS 策略
CREATE POLICY "Users can view their own data" ON customer
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON customer
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON customer
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 暂时禁用管理员策略，避免递归
-- CREATE POLICY "Admins can view all customer data" ON customer
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM customer c
--             WHERE c.user_id = auth.uid() AND c.admin = true
--         )
--     );

-- message 表的 RLS 策略
CREATE POLICY "Users can view their own messages" ON message
    FOR SELECT USING (
        customer_id IN (
            SELECT id FROM customer c WHERE c.user_id = auth.uid()
        )
    );

-- 暂时禁用管理员策略，避免递归
-- CREATE POLICY "Admins can view all messages" ON message
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM customer c
--             WHERE c.user_id = auth.uid() AND c.admin = true
--         )
--     );

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
CREATE INDEX IF NOT EXISTS idx_customer_user_id ON customer(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_admin ON customer(admin);
CREATE INDEX IF NOT EXISTS idx_message_customer_id ON message(customer_id);
CREATE INDEX IF NOT EXISTS idx_message_status ON message(status);
CREATE INDEX IF NOT EXISTS idx_customer_created_at ON customer(created_at);
CREATE INDEX IF NOT EXISTS idx_message_created_at ON message(created_at);

-- 创建视图用于分析
CREATE OR REPLACE VIEW customer_daily AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
FROM customer
GROUP BY DATE(created_at)
ORDER BY date;

CREATE OR REPLACE VIEW message_daily AS
SELECT 
    DATE(m.created_at) as date,
    COUNT(*) as count
FROM message m
GROUP BY DATE(m.created_at)
ORDER BY date;

CREATE OR REPLACE VIEW customer_role_pie AS
SELECT 
    role,
    COUNT(*) as count
FROM customer
WHERE role IS NOT NULL
GROUP BY role
ORDER BY count DESC;

-- 创建触发器函数来更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加 updated_at 触发器
CREATE TRIGGER update_customer_updated_at 
    BEFORE UPDATE ON customer 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_updated_at 
    BEFORE UPDATE ON message 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
