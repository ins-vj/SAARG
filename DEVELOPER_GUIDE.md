# FarmReport - Developer Guide

## Quick Start for Developers

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Initial Setup (5 minutes)

```bash
# 1. Clone or download the project
# cd into the project directory

# 2. Install dependencies
npm install

# 3. Create .env.local file with:
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

## Project Architecture

### File Organization

```
Presentational Layer (UI Components)
        ↓
Logic Layer (Hooks, Utilities)
        ↓
Data Layer (Supabase, APIs)
        ↓
Database (PostgreSQL)
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `/app` | Next.js app router pages and layouts |
| `/components/ui` | shadcn/ui reusable components |
| `/components/dashboard` | Feature-specific components |
| `/lib/supabase` | Supabase client initialization |
| `/app/api` | Backend API routes |
| `/middleware.ts` | Route protection and redirects |

## Common Development Tasks

### 1. Adding a New Page

```typescript
// app/dashboard/new-feature/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewFeaturePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h1>New Feature</h1>
      {/* Your content */}
    </div>
  )
}
```

### 2. Using Supabase Client

```typescript
// Browser (client component)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server-side
import { createServerSupabaseClient } from '@/lib/supabase/server'
const supabase = await createServerSupabaseClient()

// Example queries
const { data, error } = await supabase
  .from('reports')
  .select('*')
  .eq('user_id', user.id)
```

### 3. Creating an API Endpoint

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process request
    const result = { success: true, data: body }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. Adding a New Component

```typescript
// components/dashboard/my-component.tsx
'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  children?: ReactNode
  onAction?: () => void
}

export function MyComponent({
  title,
  children,
  onAction,
}: MyComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="mt-2">{children}</div>}
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          Action
        </Button>
      )}
    </div>
  )
}
```

### 5. Handling Authentication

```typescript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  router.push('/') // Redirect to login
}

// Sign out
await supabase.auth.signOut()
router.push('/')

// Update user metadata
await supabase.auth.updateUser({
  data: { custom_field: 'value' }
})
```

## Component Patterns

### Loading State
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )
}
```

### Error Handling
```typescript
{error && (
  <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
    <div>
      <h3 className="font-medium text-red-900">Error</h3>
      <p className="text-sm text-red-700">{error}</p>
    </div>
  </div>
)}
```

### Card Component Pattern
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Styling Guidelines

### Using Tailwind Classes
- Prefer semantic classes: `flex items-center justify-between`
- Use spacing scale: `p-4`, `mb-6`, `gap-3`
- Responsive prefixes: `md:grid-cols-2`, `lg:text-lg`
- Dark mode: `dark:bg-slate-900`, `dark:text-white`

### Color Usage
- Primary (Green): `bg-green-600`, `text-green-600`
- Error (Red): `bg-red-50`, `text-red-600`
- Info (Blue): `bg-blue-50`, `text-blue-600`
- Dark mode backgrounds: `dark:bg-slate-900`

### Example Styling
```typescript
<div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Title</h2>
  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Description</p>
</div>
```

## Database Operations

### Reading Data
```typescript
// Single record
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('id', recordId)
  .single()

// Multiple records
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

### Creating Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert([
    {
      column1: 'value1',
      column2: 'value2',
    }
  ])
```

### Updating Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({ column1: 'new_value' })
  .eq('id', recordId)
```

### Deleting Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId)
```

## Debugging

### Debug Logging
```typescript
console.log('[v0] Message:', variable)
console.error('[v0] Error:', error)
```

### Browser DevTools
- F12 or Ctrl+Shift+I to open
- Console tab for logs and errors
- Network tab for API calls
- Application tab for localStorage/cookies
- Elements tab for HTML inspection

### Supabase Dashboard
- Monitor real-time data changes
- View authentication logs
- Check database queries
- Monitor API usage

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not set"
**Solution**: Create `.env.local` file with correct variables

### Issue: Authentication not working
**Solution**: 
1. Verify Supabase project URL and key
2. Check that Supabase Auth is enabled
3. Verify Google OAuth settings if using Google login
4. Clear browser cache and cookies

### Issue: Camera access denied
**Solution**:
1. Check browser permissions
2. Use HTTPS in production (http://localhost works for dev)
3. Add microphone/camera permission requests

### Issue: PDF not generating
**Solution**:
1. Check browser console for jsPDF errors
2. Verify image data format
3. Check API response status

## Performance Optimization

### Image Optimization
```typescript
// Use Image component for automatic optimization
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={640}
  height={480}
  priority // Only for above-fold images
/>
```

### Code Splitting
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <LoadingSpinner />,
})
```

### Caching
```typescript
// Cache API responses
const response = await fetch('/api/endpoint', {
  next: { revalidate: 60 } // Cache for 60 seconds
})
```

## Testing Checklist

Before committing code:
- [ ] No console errors
- [ ] Works on mobile
- [ ] Dark mode works
- [ ] All links work
- [ ] Forms validate
- [ ] Error states display
- [ ] Loading states show
- [ ] Logout works

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "feat: description of changes"

# Push to repository
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Deployment

### Vercel Deployment
```bash
# Connect GitHub to Vercel
# Add environment variables in Vercel dashboard
# Automatic deployment on push to main
```

### Manual Deployment
```bash
npm run build
npm run start
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Documentation](https://react.dev)

## Getting Help

1. Check the code comments
2. Review the PROJECT_SUMMARY.md
3. Look for similar implementations in the codebase
4. Check error messages in console
5. Review Supabase logs

## Code Style Guidelines

- Use TypeScript for type safety
- Use const/let (no var)
- Use arrow functions
- Use destructuring
- Use template literals for strings
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

Example:
```typescript
// ✅ Good
const handleSubmit = async (formData: FormData) => {
  try {
    const result = await processData(formData)
    return result
  } catch (error) {
    console.error('Processing failed:', error)
  }
}

// ❌ Avoid
const submit = (data) => {
  let result = processData(data)
  return result
}
```

---

**Last Updated**: 2026-02-09
