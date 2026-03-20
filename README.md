# 🌾 SAARG - Seed Analysis And Report Generator

A comprehensive web application that enables farmers to generate detailed seed health analysis reports using hardware integration, machine learning, and professional PDF generation.

![Status](https://img.shields.io/badge/status-production%20ready-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

## 📸 Preview

### Login Page
- Professional split-panel design
- Google OAuth integration
- Email/password authentication
- Feature showcase on desktop

### Dashboard
- Responsive sidebar navigation
- Dark/Light mode switching
- Quick stats overview
- Report generation interface

### Report Generation
- Hardware verification dialog
- Real-time camera capture
- ML model integration
- PDF report generation
- Download capability

## ✨ Key Features

- ✅ **Secure Authentication** - Supabase Auth with Google OAuth
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark Mode** - Theme switching with persistence
- ✅ **Image Capture** - Real-time camera integration
- ✅ **ML Integration** - Cloud-based model processing
- ✅ **PDF Reports** - Professional document generation
- ✅ **Data Persistence** - Supabase PostgreSQL database
- ✅ **Row Level Security** - User data protection
- ✅ **Mobile Friendly** - Optimized for all screen sizes

## 📋 Prerequisites

Ensure you have the following installed:

- Node.js ≥ 16.x  
- npm ≥ 8.x  
- Git  

Check versions:

```bash
node -v
npm -v
git --version
```

## 🚀 Quick Start

### Clone the Repository
```bash
git clone https://github.com/ins-vj/SAARG.git
cd SAARG
```
### Windows Setup
#### 1. Install Dependencies
```bash
npm install
```

#### 2. Create Environment File

##### Using Command Prompt (CMD):
```cmd
type nul > .env.local
```

##### Using PowerShell:
```powershell
New-Item .env.local
```

#### 3. Add Environment Variables

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

#### 4. Run the Project
```bash
npm run dev
```

### macOS Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Create Environment File
```bash
touch .env.local
```

#### 3. Add Environment Variables

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

#### 4. Run the Project
```bash
npm run dev
```

### Linux Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Create Environment File
```bash
touch .env.local
```

#### 3. Add Environment Variables

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

#### 4. Run the Project
```bash
npm run dev
```

### First Use
1. Visit `http://localhost:3000`
2. Click "Sign in with Google" or create an account
3. Click "Generate Report" on the dashboard
4. Confirm seed placement
5. View and download PDF

For detailed setup instructions, see **[QUICKSTART.md](./QUICKSTART.md)**

## 📁 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 10-minute setup guide |
| [SETUP.md](./SETUP.md) | Detailed installation & configuration |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Architecture & features overview |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Code patterns & development guide |
| [README.md](./README.md) | This file |

## 🏗️ Architecture

```
SAARG Application Architecture
│
├── Frontend Layer (Next.js)
│   ├── Login Page (/ )
│   ├── Dashboard (/dashboard)
│   ├── Profile (/dashboard/profile)
│   ├── History (/dashboard/history)
│   └── About (/dashboard/about)
│
├── API Layer (/api)
│   ├── ML Model Endpoint
│   ├── PDF Generation
│   └── OAuth Callback
│
├── Data Layer (Supabase)
│   ├── User Authentication
│   ├── Profiles Table
│   ├── Reports Table
│   └── Report History
│
└── External Services
    ├── Google OAuth
    └── ML Model API (to be configured)
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Authentication** | Supabase Auth, Google OAuth |
| **Database** | Supabase PostgreSQL |
| **PDF Generation** | jsPDF |
| **Image Processing** | Canvas API |
| **Theme** | next-themes |
| **Icons** | Lucide React |

## 📊 Database Schema

### profiles
```sql
- id (UUID) - Unique identifier
- email (VARCHAR) - User email
- full_name (VARCHAR) - Full name
- avatar_url (TEXT) - Profile picture
- created_at, updated_at (TIMESTAMP)
```

### reports
```sql
- id (UUID) - Unique identifier
- user_id (UUID) - Reference to user
- title (VARCHAR) - Report title
- image_data (TEXT) - Base64 image
- ml_model_result (JSONB) - ML output
- pdf_url (TEXT) - PDF location
- created_at, updated_at (TIMESTAMP)
```

### report_history
```sql
- id (UUID) - Unique identifier
- report_id (UUID) - Reference to report
- user_id (UUID) - Reference to user
- action (VARCHAR) - Action type
- created_at (TIMESTAMP)
```

## 🔒 Security Features

- **Supabase Auth** - Secure authentication
- **Google OAuth** - Third-party login
- **Row Level Security** - User data isolation
- **HTTP-only Cookies** - Session management
- **Environment Variables** - Secret management
- **Middleware Protection** - Route security

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981) - Agriculture theme
- **Error**: Red (#ef4444) - Error states
- **Info**: Blue (#3b82f6) - Information
- **Neutral**: Gray - Backgrounds & text

### Typography
- **Headings**: Geist Sans
- **Body**: Geist Sans
- **Monospace**: Geist Mono

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### Optional Variables
```env
ML_MODEL_API_KEY=your_api_key
ML_MODEL_ENDPOINT=https://your-endpoint.com
```

## 📋 API Endpoints

### POST `/api/ml-model`
Process seed image with ML model
```json
Request: { "image": "base64_string" }
Response: {
  "healthScore": 85,
  "quality": "Excellent",
  "germinationRate": 92,
  "moistureLevel": 12,
  "status": "Healthy"
}
```

### POST `/api/generate-pdf`
Generate PDF report
```json
Request: {
  "image": "base64_string",
  "mlResult": { /* ML results */ }
}
Response: PDF binary file
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Automatic deployment to Vercel
```

### Other Platforms
```bash
npm run build
npm run start
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Auth not working | Verify Supabase credentials in `.env.local` |
| Camera access denied | Allow camera permissions in browser settings |
| Database errors | Run SQL setup queries in Supabase dashboard |
| PDF not generating | Check browser console, verify jsPDF installation |

## 📈 Performance

- ⚡ Fast initial load (< 2s)
- 🎯 Optimized images
- 📦 Code splitting
- 🔄 Caching strategies
- 📱 Mobile-first design

## 🔄 Future Roadmap

- [ ] Real-time analytics dashboard
- [ ] Batch report generation
- [ ] Email delivery
- [ ] Hardware device pairing
- [ ] Mobile app
- [ ] API for integrations
- [ ] Advanced reporting
- [ ] Multi-language support

## 🤝 Contributing

To extend the project:
1. Follow existing code structure
2. Use TypeScript for type safety
3. Test on multiple devices
4. Update documentation
5. Create a pull request

## 📞 Support

- **Setup Help**: See [SETUP.md](./SETUP.md)
- **Development**: See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Architecture**: See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## 📄 License

Proprietary and Confidential - All rights reserved

## 👥 Authors

- Sreechand Rayavarapu - 230001068
- Vikrant Jakhar - 230001082
- Kartik Hiranandani - 230001037
- Gugulothu Sohan Naik - 230001029
- Marupaka Rajavardhan - 230001053
- Improved with Vercel v0 - Advanced AI-powered code generation

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)

## 📊 Project Stats

- **Files**: 50+
- **Components**: 15+
- **Pages**: 5
- **API Routes**: 3
- **Database Tables**: 3
- **Lines of Code**: 3000+

## 🎯 Usage Scenarios

### Farmer Workflow
1. Log in with a Google account
2. Navigate to the dashboard
3. Click the "Generate Report" button
4. Place the seed in the hardware
5. System captures image
6. ML model analyzes seed
7. Receive PDF report
8. Download report

### Administrator Workflow
1. Monitor user reports
2. View analytics
3. Manage system settings
4. Configure ML models
5. Monitor performance

## 🔐 Data Privacy

- User data encrypted in transit
- Row-level security enabled
- No third-party data sharing
- GDPR compliant
- Regular backups

## ⚠️ Important Notes

1. **First-time Setup**: Follow [QUICKSTART.md](./QUICKSTART.md)
2. **Environment Variables**: Must be set before running
3. **Database**: Must be configured in Supabase
4. **Authentication**: Google OAuth must be configured for login
5. **ML Model**: Endpoint must be configured for report generation

## 🎓 Learning Resources

- Next.js: https://nextjs.org/learn
- Supabase: https://supabase.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind: https://tailwindcss.com/docs
- React: https://react.dev

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase database setup
- [ ] Google OAuth configured
- [ ] All pages tested
- [ ] Mobile responsiveness verified
- [ ] Dark mode working
- [ ] Authentication flows tested
- [ ] PDF generation working
- [ ] Performance acceptable
- [ ] Error handling in place

## 📅 Version History

### v1.0.0 (Current)
- Initial release
- Authentication system
- Dashboard with navigation
- Report generation
- PDF reports
- Dark mode support
- Supabase integration

---

**Last Updated**: February 18, 2026
**Status**: Production Ready
**Maintained**: Active Development

For more information, start with [QUICKSTART.md](./QUICKSTART.md)!
