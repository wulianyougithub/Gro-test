# Ground - AI 驱动的收入发现平台

[English](./README.md) | [中文](#)

## 项目概述

Ground 是一个基于 Next.js 和 Supabase 构建的企业级后台管理系统，旨在通过 AI 驱动的 LinkedIn 外联消息帮助公司发现未开发的收入机会。

## 功能特性

- 🔐 **身份认证**: 基于邮箱的注册和登录，使用 Supabase Auth
- 🌍 **国际化**: 多语言支持（中文/英文），使用 next-intl
- 👥 **用户管理**: 基于角色的访问控制，支持管理员权限
- 💬 **消息管理**: AI 生成的 LinkedIn 外联消息，支持审批流程
- 📊 **分析仪表板**: 实时统计数据和数据可视化
- 🔄 **实时更新**: 实时消息状态跟踪和通知
- 📱 **响应式设计**: 针对所有设备优化的现代 UI

## 技术栈

- **前端**: Next.js 14 (App Router), React 18, TypeScript
- **后端**: Supabase (PostgreSQL, Auth, RLS)
- **样式**: Tailwind CSS
- **图表**: Recharts
- **AI**: OpenAI API
- **国际化**: next-intl

## 目录结构

```
Gro-test/
├── src/
│   ├── app/
│   │   ├── [locale]/           # 多语言路由
│   │   │   ├── admin/          # 管理员仪表板
│   │   │   │   ├── analysis/   # 分析页面
│   │   │   │   ├── message/    # 消息管理
│   │   │   │   └── user/       # 用户管理
│   │   │   ├── dashboard/      # 用户仪表板
│   │   │   │   ├── onboarding/ # 用户引导
│   │   │   │   └── waiting/    # 消息等待页面
│   │   │   ├── login/          # 登录页面
│   │   │   └── register/       # 注册页面
│   │   ├── api/                # API 路由
│   │   │   ├── admin-analysis/ # 分析 API
│   │   │   ├── admin-messages/ # 消息管理 API
│   │   │   ├── admin-users/    # 用户管理 API
│   │   │   └── generate-message/ # AI 消息生成
│   │   └── globals.css         # 全局样式
│   ├── components/             # 可复用组件
│   ├── lib/                    # 工具库
│   │   └── supabaseClient.ts   # Supabase 客户端
│   ├── messages/               # 翻译文件
│   │   ├── en.json            # 英文翻译
│   │   └── zh.json            # 中文翻译
│   ├── utils/                  # 工具函数
│   │   └── fetchWithAuth.ts    # 认证请求工具
│   └── withAuthGuard.tsx       # 认证高阶组件
├── supabase/                   # Supabase 配置
│   ├── migrations/             # 数据库迁移
│   └── seed.sql               # 种子数据
├── public/                     # 静态资源
├── package.json               # 依赖包
└── README.md                  # 英文文档
```

## 数据库结构

### 数据表
- **customer**: 用户资料和公司信息
- **message**: AI 生成的外联消息，包含状态跟踪

### 视图
- **customer_daily**: 每日用户注册统计
- **message_daily**: 每日消息生成统计
- **customer_role_pie**: 用户角色分布

## 开发环境启动

### 前置要求

- Node.js 18+
- npm 或 yarn
- Supabase 账户
- OpenAI API 密钥

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/wulianyougithub/Gro-test.git
   cd Gro-test
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   创建 `.env.local` 文件：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key
   OPENAI_API_KEY=你的_openai_api_key
   ```

4. **数据库设置** [更多请查看SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)
   ```bash
   # 安装 Supabase CLI
   npm install -g supabase
   
   # 登录 Supabase
   supabase login
   
   # 链接到你的项目
   supabase link --project-ref 你的项目引用
   
   # 应用迁移和种子数据
   supabase db reset --linked
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **打开浏览器**
   访问 `http://localhost:8001`

## 开发工作流

1. **数据库变更**: 使用 `supabase migration new <name>` 创建新迁移
2. **应用变更**: 使用 `supabase db push --linked` 应用到远程数据库
3. **重置数据库**: 使用 `supabase db reset --linked` 重置并应用种子数据

## API 接口

- `GET /api/admin-analysis` - 获取分析数据
- `GET /api/admin-messages` - 获取所有消息
- `PATCH /api/admin-messages` - 更新消息状态
- `GET /api/admin-users` - 获取所有用户
- `PATCH /api/admin-users` - 更新用户管理员状态
- `POST /api/generate-message` - 生成 AI 消息

## 部署

应用程序可以部署到 Vercel、Netlify 或任何其他支持 Next.js 的平台。

## 文档

- [THINKING.md](./THINKING.md) - 项目思考与架构设计（英文）
- [THINKING.zh.md](./THINKING.zh.md) - 项目思考与架构设计
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - 数据库迁移指南

## 许可证

MIT License 