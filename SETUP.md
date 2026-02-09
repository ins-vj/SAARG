# FarmReport - Setup Guide

## Overview

FarmReport is a comprehensive farmer management website that helps farmers generate advanced seed health analysis reports. The application includes:

- **Authentication**: Gmail login + email/password signup via Supabase
- **Dashboard**: Central hub with sidebar navigation
- **Report Generation**: Image capture with ML model integration
- **PDF Reports**: Professional report generation and download
- **Dark Mode**: Built-in theme switching

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase project (https://supabase.com)
- Environment variables configured

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the project root with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up Supabase database:**

In your Supabase dashboard, create the following tables:

**profiles table:**
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) unique not null,
  full_name varchar(255),
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

**reports table:**
```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(255),
  image_data text,
  ml_model_result jsonb,
  pdf_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

**report_history table:**
```sql
create table report_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action varchar(50),
  created_at timestamp default now()
);
```

4. **Enable Row Level Security (RLS):**

Enable RLS on each table and add appropriate policies in the Supabase dashboard.

5. **Configure Google OAuth (Optional):**

To enable Google sign-in:
1. Go to Supabase Authentication settings
2. Add a Google provider
3. Configure your Google OAuth credentials
4. Update the redirect URI to match your deployed URL

## Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Features

### Authentication
- **Google Sign-in**: Quick login via Gmail
- **Email/Password**: Standard email and password authentication
- **Secure Session**: Managed through Supabase Auth

### Dashboard
- **Sidebar Navigation**: Access History, Profile, and About sections
- **Main Content Area**: Report generation interface
- **Header**: Theme switcher (Light/Dark mode)

### Report Generation
1. Click "Generate Report" button
2. Confirm seed placement in hardware device
3. System captures image from camera
4. ML model processes the image
5. PDF report is generated and displayed
6. Download the report or generate a new one

### Key Pages
- **Dashboard** (`/dashboard`): Main hub with report generation
- **History** (`/dashboard/history`): View all previous reports
- **Profile** (`/dashboard/profile`): Manage account settings
- **About** (`/dashboard/about`): Learn about FarmReport

## ML Model Integration

The `/api/ml-model` endpoint provides mock ML results. To integrate your actual ML model:

1. Update `/app/api/ml-model/route.ts`
2. Replace the mock response with a call to your cloud-based ML service
3. Include your API key in environment variables
4. Handle the response and format it appropriately

Example:
```typescript
const response = await fetch('https://your-ml-endpoint.com/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ML_MODEL_API_KEY}`,
  },
  body: JSON.stringify({ image }),
})
```

## PDF Generation

The `/api/generate-pdf` endpoint creates professional PDF reports using jsPDF. The PDF includes:
- Report title and timestamp
- Captured seed image
- ML analysis results
- Recommendations

## Database Schema

### profiles
- `id` (UUID): User ID from Supabase Auth
- `email` (VARCHAR): User email
- `full_name` (VARCHAR): User's full name
- `avatar_url` (TEXT): Profile picture URL
- `created_at`, `updated_at` (TIMESTAMP): Metadata

### reports
- `id` (UUID): Report unique identifier
- `user_id` (UUID): Reference to user
- `title` (VARCHAR): Report title
- `image_data` (TEXT): Base64 encoded image
- `ml_model_result` (JSONB): ML model output
- `pdf_url` (TEXT): Stored PDF location
- `created_at`, `updated_at` (TIMESTAMP): Metadata

### report_history
- `id` (UUID): History entry ID
- `report_id` (UUID): Reference to report
- `user_id` (UUID): Reference to user
- `action` (VARCHAR): Action type (created, viewed, downloaded)
- `created_at` (TIMESTAMP): When action occurred

## Dark Mode

The application uses `next-themes` for dark mode support. Theme preference is stored in localStorage and persists across sessions.

To manually trigger theme change:
```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme(theme === 'dark' ? 'light' : 'dark')
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
```bash
npm run build
npm run start
```

## Troubleshooting

**Issue**: "NEXT_PUBLIC_SUPABASE_URL is required"
- **Solution**: Ensure your `.env.local` file contains the Supabase URL and anon key

**Issue**: Authentication not working
- **Solution**: Check that Supabase Auth is enabled and configured properly

**Issue**: Camera access denied
- **Solution**: Ensure the browser has camera permissions and you're accessing via HTTPS in production

**Issue**: PDF not generating
- **Solution**: Check browser console for errors and ensure jsPDF is properly installed

## Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **PDF Generation**: jsPDF
- **UI Components**: shadcn/ui
- **Theme**: next-themes
- **Icons**: Lucide React

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Supabase RLS**: Enable Row Level Security for all tables
3. **CORS**: Configure CORS policies appropriately
4. **HTTPS**: Always use HTTPS in production
5. **API Keys**: Rotate API keys regularly

## Support

For questions or issues, contact support@farmreport.com

## License

This project is proprietary and confidential.
