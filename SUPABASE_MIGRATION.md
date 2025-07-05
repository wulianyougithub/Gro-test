# Supabase 迁移使用指南

## 项目结构

```
supabase/
├── migrations/
│   └── 20250704203813_initial_schema.sql  # 初始数据库架构
├── seed.sql                               # 种子数据
└── config.toml                            # Supabase 配置
```

## 数据库表结构

### customer 表
- `id`: UUID 主键
- `email`: 邮箱（唯一）
- `name`: 姓名
- `company_name`: 公司名称
- `role`: 角色
- `linkedin_url`: LinkedIn 链接
- `user_id`: 用户 ID（关联 auth.users）
- `admin`: 是否为管理员
- `created_at`: 创建时间
- `updated_at`: 更新时间

### message 表
- `id`: UUID 主键
- `customer_id`: 客户 ID（关联 customer）
- `message`: 消息内容
- `status`: 状态（draft/approve/sent）
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 分析视图
- `customer_daily_stats`: 每日注册用户统计
- `message_daily_stats`: 每日消息统计
- `role_distribution`: 用户角色分布

## 使用方法

### 1. 链接到远程项目

```bash
# 登录 Supabase
npx supabase@latest login

# 链接到远程项目（需要项目引用 ID）
npx supabase@latest link --project-ref your-project-ref
```

### 2. 应用迁移

```bash
# 推送到远程数据库
npx supabase@latest db push --linked

# 重置数据库（删除所有数据）
npx supabase@latest db reset --linked
```

### 3. 本地开发，需要本地安装docker

```bash
# 启动本地 Supabase
npx supabase@latest start

# 停止本地 Supabase
npx supabase@latest stop

# 查看状态
npx supabase@latest status
```

### 4. 创建新迁移

```bash
# 创建新的迁移文件
npx supabase@latest migration new add_new_feature

# 编辑生成的迁移文件
# 然后推送到远程
npx supabase@latest db push
```

## 安全策略

### RLS (Row Level Security)
- 用户只能查看自己的数据
- 自动更新 `updated_at` 字段

### 索引优化
- 邮箱索引
- 用户 ID 索引
- 管理员状态索引
- 消息状态索引
- 创建时间索引

## 注意事项

1. **user_id 字段**: 需要关联到 `auth.users` 表中的真实用户 ID
2. **种子数据**: 包含测试数据，生产环境需要替换为真实数据
3. **权限控制**: 通过 RLS 策略控制数据访问权限
4. **数据完整性**: 使用外键约束确保数据一致性

## 获取项目引用 ID

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings → General
4. 复制 "Reference ID"

## 故障排除

### 常见问题

1. **链接失败**: 检查项目引用 ID 是否正确
2. **权限错误**: 确保有项目的管理权限
3. **迁移失败**: 检查 SQL 语法是否正确

### 调试命令

```bash
# 查看详细错误信息
npx supabase@latest db push --debug

# 查看迁移状态
npx supabase@latest migration list --debug
``` 