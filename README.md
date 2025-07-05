# Ground - AI-Powered Revenue Discovery Platform

[English](#english) | [中文](./README.zh.md)

---

## English

### Overview

Ground is an enterprise backend management system built with Next.js and Supabase, designed to help companies uncover untapped revenue opportunities through AI-powered LinkedIn outreach messages.

### Features

- 🔐 **Authentication**: Email-based registration and login with Supabase Auth
- 🌍 **Internationalization**: Multi-language support (English/Chinese) with next-intl
- 👥 **User Management**: Role-based access control with admin privileges
- 💬 **Message Management**: AI-generated LinkedIn outreach messages with approval workflow
- 📊 **Analytics Dashboard**: Real-time statistics and data visualization
- 🔄 **Real-time Updates**: Live message status tracking and notifications
- 📱 **Responsive Design**: Modern UI optimized for all devices

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI**: OpenAI API
- **Internationalization**: next-intl

### Project Structure

```
Gro-test/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Multi-language routing
│   │   │   ├── admin/          # Admin dashboard
│   │   │   │   ├── analysis/   # Analytics page
│   │   │   │   ├── message/    # Message management
│   │   │   │   └── user/       # User management
│   │   │   ├── dashboard/      # User dashboard
│   │   │   │   ├── onboarding/ # User onboarding
│   │   │   │   └── waiting/    # Message waiting page
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── api/                # API routes
│   │   │   ├── admin-analysis/ # Analytics API
│   │   │   ├── admin-messages/ # Message management API
│   │   │   ├── admin-users/    # User management API
│   │   │   └── generate-message/ # AI message generation
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   ├── lib/                    # Utility libraries
│   │   └── supabaseClient.ts   # Supabase client
│   ├── messages/               # Translation files
│   │   ├── en.json            # English translations
│   │   └── zh.json            # Chinese translations
│   ├── utils/                  # Utility functions
│   │   └── fetchWithAuth.ts    # Authenticated fetch utility
│   └── withAuthGuard.tsx       # Authentication HOC
├── supabase/                   # Supabase configuration
│   ├── migrations/             # Database migrations
│   └── seed.sql               # Seed data
├── public/                     # Static assets
├── package.json               # Dependencies
└── README.md                  # This file
```

### Database Schema

#### Tables
- **customer**: User profiles and company information
- **message**: AI-generated outreach messages with status tracking

#### Views
- **customer_daily**: Daily user registration statistics
- **message_daily**: Daily message generation statistics
- **customer_role_pie**: User role distribution

### Getting Started

#### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wulianyougithub/Gro-test.git
   cd Gro-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup** [more SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref your_project_ref
   
   # Apply migrations and seed data
   supabase db push --linked
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8001`

### Development Workflow

1. **Database Changes**: Create new migrations using `supabase migration new <name>`
2. **Apply Changes**: Use `supabase db push --linked` to apply to remote database
3. **Reset Database**: Use `supabase db reset --linked` to reset with seed data

### API Endpoints

- `GET /api/admin-analysis` - Get analytics data
- `GET /api/admin-messages` - Get all messages
- `PATCH /api/admin-messages` - Update message status
- `GET /api/admin-users` - Get all users
- `PATCH /api/admin-users` - Update user admin status
- `POST /api/generate-message` - Generate AI message

### Deployment

The application can be deployed to Vercel, Netlify, or any other Next.js-compatible platform.

### Documentation

- [THINKING.md](./THINKING.md) - Project thinking and architecture
- [THINKING.zh.md](./THINKING.zh.md) - 项目思考与架构设计（中文）
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Database migration guide

---

## License

MIT License
