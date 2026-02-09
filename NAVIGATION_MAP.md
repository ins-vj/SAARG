# FarmReport - Application Navigation Map

## 🗺️ Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FarmReport Application                          │
│                     Navigation Structure                            │
└─────────────────────────────────────────────────────────────────────┘

                            START
                              │
                              ▼
                        ┌──────────────┐
                        │  / (Login)   │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌──────────────────┐  ┌──────────────────┐
            │ Sign with Google │  │ Email & Password │
            │     (OAuth)      │  │  (Sign Up/In)    │
            └──────────┬───────┘  └────────┬─────────┘
                       │                    │
                       └────────┬───────────┘
                                │
                    ✅ Authentication Success
                                │
                                ▼
                        ┌──────────────────────┐
                        │ /dashboard (Main)    │
                        │ • Report Generator   │
                        │ • Stats Cards        │
                        └──────────┬───────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  Sidebar     │  │  Header      │  │  Main Content│
        │              │  │              │  │              │
        │ • Dashboard  │  │ • Theme      │  │ • Generate   │
        │ • History    │  │   Toggle     │  │   Report     │
        │ • Profile    │  │              │  │ • Stats      │
        │ • About      │  │              │  │              │
        │ • Logout     │  │              │  │              │
        └──────┬───────┘  └──────────────┘  └──────────────┘
               │
    ┌──────────┼──────────┬─────────────┬──────────────┐
    │          │          │             │              │
    ▼          ▼          ▼             ▼              ▼
┌────────┐ ┌───────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Profile │ │History│ │Dashboard │ │ About  │ │ Logout   │
│ Page   │ │ Page  │ │(Current) │ │ Page   │ │ (Back to │
│        │ │       │ │          │ │        │ │  Login)  │
│Update: │ │View:  │ │Actions:  │ │Learn:  │ │          │
│• Name  │ │•Reports│•Generate  │ │•Purpose│ │Sign Out  │
│• Email │ │• Stats│ │Report    │ │•Feature│ │→ /       │
│        │ │•Downlod│•View Stats│ │• Tech  │ │          │
└────────┘ └───────┘ └──────────┘ └────────┘ └──────────┘
```

---

## 📍 Page Routes

### Authentication
```
/                          → Login Page
├─ /auth/callback         → Google OAuth callback
└─ (Email signup/signin)  → In-page forms
```

### Protected Routes (Dashboard)
```
/dashboard                 → Main Dashboard
├─ /dashboard/profile      → User Profile
├─ /dashboard/history      → Report History
└─ /dashboard/about        → About Page
```

### API Routes
```
/api/ml-model             → ML Model Processing
/api/generate-pdf         → PDF Generation
```

---

## 🔄 User Journey Flows

### Flow 1: First-Time User
```
1. Visit http://localhost:3000
2. See Login Page with features
3. Click "Sign in with Google"
4. Authenticate with Gmail
5. Redirected to /auth/callback
6. Auto-redirected to /dashboard
7. See welcome message and dashboard
8. Click "Generate Report"
9. Follow report generation flow
```

### Flow 2: Report Generation
```
1. On /dashboard
2. Click "Generate Report" button
3. Hardware dialog appears
4. Confirm seed placement checkbox
5. Click "Proceed with Analysis"
6. Camera starts capturing (hidden)
7. Loading spinner shows
8. ML model processes image
9. PDF generated and displayed
10. Option to download or generate new
```

### Flow 3: Manage Profile
```
1. Click "Profile" in sidebar
2. Navigate to /dashboard/profile
3. View email address (read-only)
4. Update full name field
5. Click "Save Changes"
6. Confirmation and save
```

### Flow 4: View History
```
1. Click "History" in sidebar
2. Navigate to /dashboard/history
3. See all previous reports
4. Click "Download" to get PDF
5. Click trash icon to delete
```

### Flow 5: Learn About
```
1. Click "About" in sidebar
2. Navigate to /dashboard/about
3. Read about mission
4. Learn how it works
5. View features list
6. Check security info
```

---

## 🎨 Component Hierarchy

```
RootLayout
├── ThemeProvider (next-themes)
│
├── LoginPage (/)
│   ├── FeatureItem components
│   └── Authentication forms
│
└── DashboardLayout (/dashboard/*)
    ├── Sidebar
    │   ├── Logo
    │   ├── NavItems
    │   │   ├── Dashboard link
    │   │   ├── History link
    │   │   ├── Profile link
    │   │   └── About link
    │   └── Logout button
    │
    ├── Header
    │   ├── Spacer
    │   └── ThemeToggle button
    │
    └── Main Content
        ├── Dashboard Page (default)
        │   ├── Stats Cards
        │   └── ReportGenerator
        │       ├── HardwareDialog
        │       ├── ReportForm
        │       └── PDFViewer
        │
        ├── Profile Page
        │   └── ProfileForm
        │
        ├── History Page
        │   └── ReportList
        │
        └── About Page
            └── FeatureCards
```

---

## 🔐 Authentication States

```
┌─────────────────────────────────────────┐
│     Authentication State Machine        │
└─────────────────────────────────────────┘

STATE: UNAUTHENTICATED
├─ Can access: Login page (/)
├─ Cannot access: Any /dashboard/* routes
└─ Middleware redirects: /dashboard/* → /

        ↓ (User signs in)

STATE: AUTHENTICATED
├─ Can access: All /dashboard/* routes
├─ Can access: Login page (redirects to dashboard)
└─ Middleware redirects: / → /dashboard

        ↓ (User signs out)

STATE: UNAUTHENTICATED (back to start)
```

---

## 🎯 Component to Page Mapping

| Component | Location | Used In | Purpose |
|-----------|----------|---------|---------|
| Sidebar | `/dashboard/sidebar.tsx` | Dashboard | Navigation |
| Header | `/dashboard/header.tsx` | Dashboard | Theme toggle |
| ReportGenerator | `/dashboard/report-generator.tsx` | Dashboard | Main feature |
| HardwareDialog | `/dashboard/hardware-dialog.tsx` | ReportGenerator | Verification |
| PDFViewer | `/dashboard/pdf-viewer.tsx` | ReportGenerator | PDF display |
| FeatureItem | `/app/page.tsx` | Login | Feature cards |

---

## 📊 Data Flow

```
User Interaction
    ↓
Component State (React hooks)
    ↓
Supabase Client / API Call
    ↓
Backend (/api route)
    ↓
Database (Supabase) / External Service
    ↓
Response
    ↓
Update Component State
    ↓
UI Re-renders
```

---

## 🔄 Report Generation Flow (Detailed)

```
┌─────────────────────────────────────────────────────────┐
│          Report Generation Process Flow                 │
└─────────────────────────────────────────────────────────┘

START: User clicks "Generate Report"
    ↓
SHOW: HardwareDialog
    │
    ├─ Farmer confirms: "Seed is placed"
    │
    └─ Farmer clicks: "Proceed with Analysis"
        ↓
        REQUEST CAMERA ACCESS
        ├─ Browser asks for permission
        └─ User allows camera
            ↓
            START VIDEO STREAM
            ├─ Camera opens (hidden)
            └─ Video feed captured
                ↓
                WAIT 2 SECONDS
                └─ Ensure stable image
                    ↓
                    CAPTURE FRAME
                    ├─ Canvas draws video frame
                    ├─ Convert to BASE64
                    └─ Store in memory
                        ↓
                        STOP VIDEO STREAM
                        └─ Release camera
                            ↓
                            POST TO ML API
                            │
                            ├─ /api/ml-model endpoint
                            ├─ Send: Base64 image
                            └─ Receive: Analysis results
                                ↓
                                POST TO PDF API
                                │
                                ├─ /api/generate-pdf endpoint
                                ├─ Send: Image + Results
                                └─ Receive: PDF Blob
                                    ↓
                                    DISPLAY PDF
                                    ├─ Create URL from Blob
                                    ├─ Show in PDFViewer
                                    └─ User can download
                                        ↓
                                    OPTIONS:
                                    ├─ DOWNLOAD → Save file locally
                                    └─ NEW REPORT → Start over

END: Report complete
```

---

## 🎨 Theme Toggle Flow

```
User clicks theme button in header
    ↓
useTheme hook (from next-themes)
    ↓
Theme context updates
    ↓
HTML element gets dark class
    ↓
Tailwind CSS responds with dark: classes
    ↓
UI instantly updates (all components)
    ↓
Theme preference saved to localStorage
    ↓
On next visit, saved theme loads
```

---

## 🗄️ Database Operations

### Create Profile (On first login)
```
Supabase Auth creates user
    ↓
Trigger creates profile record
    ↓
Profile appears in /profiles table
```

### Create Report
```
ReportGenerator component
    ↓
POST /api/generate-pdf
    ↓
Server saves to database
    ↓
URL stored in reports table
```

### Read Reports
```
HistoryPage loads
    ↓
Query reports table for user_id
    ↓
Display in list
```

### Update Profile
```
ProfilePage form submits
    ↓
Supabase auth.updateUser()
    ↓
User metadata updates
```

### Delete Report
```
HistoryPage delete button
    ↓
Call DELETE from reports table
    ↓
Report removed from history
```

---

## 📱 Mobile Navigation

### Desktop (>768px)
```
┌─────────────────────────────────────────┐
│           HEADER (Theme toggle)         │
├──────────────┬──────────────────────────┤
│   SIDEBAR    │   MAIN CONTENT           │
│              │                          │
│ Dashboard    │ Page content             │
│ History      │                          │
│ Profile      │                          │
│ About        │                          │
│ Logout       │                          │
└──────────────┴──────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────────┐
│ Menu | HEADER | Theme Toggle    │
├─────────────────────────────────┤
│                                 │
│      MAIN CONTENT               │
│                                 │
│    (Full width)                 │
│                                 │
│                                 │
└─────────────────────────────────┘

(Sidebar is drawer, hamburger menu opens it)
```

---

## 🔗 Quick Links Reference

| Page | URL | Component | Purpose |
|------|-----|-----------|---------|
| Login | `/` | `app/page.tsx` | Authentication |
| Dashboard | `/dashboard` | `app/dashboard/page.tsx` | Main hub |
| Profile | `/dashboard/profile` | `app/dashboard/profile/page.tsx` | User settings |
| History | `/dashboard/history` | `app/dashboard/history/page.tsx` | Past reports |
| About | `/dashboard/about` | `app/dashboard/about/page.tsx` | Info |

---

## 🚀 Deployment Navigation

### Before Deploy
1. Check all routes work locally
2. Test authentication flow
3. Verify dark mode on all pages
4. Test mobile navigation

### After Deploy
1. Visit `/` → Should see login
2. Sign in → Should go to `/dashboard`
3. Test each sidebar link
4. Test theme toggle
5. Generate test report
6. Download PDF

---

## 🎯 Keyboard Navigation

- `Tab` - Navigate between elements
- `Enter` - Submit forms, click buttons
- `Esc` - Close dialogs, drawers
- `Space` - Toggle checkboxes

---

## ♿ Accessibility Navigation

All pages include:
- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3)
- ARIA labels where needed
- Color contrast compliance
- Keyboard navigation support
- Focus indicators
- Alt text for images

---

## 🔍 Navigation Debugging

### To check current route in browser console:
```javascript
// Current URL
window.location.pathname

// Next.js router (in components)
import { useRouter } from 'next/navigation'
const router = useRouter()
console.log(router.pathname)
```

### To check authentication status:
```javascript
// In browser console
const { data: { user } } = await supabase.auth.getUser()
console.log(user)
```

---

**This map helps you understand how users move through your application. Keep it handy while developing or explaining the app to others!**

---

Last Updated: February 9, 2026
