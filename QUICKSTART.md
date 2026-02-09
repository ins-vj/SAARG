# FarmReport - Quick Start Guide

## 🚀 Get Started in 10 Minutes

### Step 1: Set Up Environment (2 minutes)

1. **Create `.env.local` file** in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from:
- Go to [Supabase](https://supabase.com)
- Create a new project
- Go to Settings → API
- Copy your project URL and anon key

### Step 2: Install Dependencies (3 minutes)

```bash
npm install
```

### Step 3: Set Up Supabase Database (3 minutes)

1. **Log in to Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run these queries:**

```sql
-- Create profiles table
create table profiles (
  id uuid primary key,
  email varchar(255) unique not null,
  full_name varchar(255),
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create reports table
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

-- Create report_history table
create table report_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action varchar(50),
  created_at timestamp default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table reports enable row level security;
alter table report_history enable row level security;
```

### Step 4: Run the Application (2 minutes)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Test Accounts

### Option 1: Use Gmail Login
- Click "Sign in with Google"
- Use any Gmail account

### Option 2: Create Email Account
- Click "Sign up" on the login page
- Enter email and password
- Check email for confirmation link (if needed)

## 📋 What You Can Do

After logging in, you can:

1. **Generate Reports**
   - Click "Generate Report" on dashboard
   - Confirm seed placement
   - View PDF report
   - Download the report

2. **View Profile**
   - Update your full name
   - View account information

3. **Check History**
   - View all your previous reports
   - Download old reports

4. **Toggle Dark Mode**
   - Click sun/moon icon in header

## 🛠 Customization

### Change Colors
Edit `/app/globals.css` CSS variables in `:root`:
```css
:root {
  --primary: 10 178 152; /* Change green color */
}
```

### Modify ML Model
Edit `/app/api/ml-model/route.ts` to integrate your actual ML model:
```typescript
// Replace this mock response with your API call
const mlResult = {
  healthScore: 85,
  quality: 'Excellent',
  // ... more fields
}
```

### Add New Pages
Create files like `/app/dashboard/new-page/page.tsx`:
```typescript
export default function NewPage() {
  return <div>Your page content</div>
}
```

## 📱 Mobile Testing

Test on mobile devices:
```bash
# Get your IP address
ipconfig getifaddr en0  # macOS
hostname -I            # Linux
ipconfig               # Windows

# Access from mobile
http://YOUR_IP:3000
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` not defined | Create `.env.local` file |
| Login not working | Check Supabase URL and key in `.env.local` |
| Camera access denied | Allow camera permissions in browser |
| Database errors | Run the SQL setup queries in Supabase |
| Dark mode not working | Clear browser cache |

## 📚 Learn More

- **Setup Details**: See `SETUP.md`
- **Project Architecture**: See `PROJECT_SUMMARY.md`
- **Developer Guide**: See `DEVELOPER_GUIDE.md`

## ✅ Verification Checklist

After setup, verify:
- [ ] App loads at http://localhost:3000
- [ ] Can see login page
- [ ] Can sign up with email
- [ ] Can see dashboard after login
- [ ] Profile page loads
- [ ] History page loads
- [ ] About page loads
- [ ] Dark mode toggle works
- [ ] Theme persists on refresh
- [ ] Sidebar navigation works

## 🚢 Deploy to Vercel (Bonus)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

Your app will be live in seconds!

## 🎯 Next Steps

1. **Customize** colors and branding
2. **Integrate** your ML model endpoint
3. **Add** more features as needed
4. **Test** thoroughly on mobile
5. **Deploy** to production

## 💬 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review code comments in components
3. Check `DEVELOPER_GUIDE.md` for patterns
4. Look at similar components for examples
5. Check browser console for errors

---

**That's it!** You now have a fully functional farmer management system. Start building! 🌾
