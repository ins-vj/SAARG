'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportGenerator } from '@/components/dashboard/report-generator'
import { FileText, Clock, CheckCircle, Leaf } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

interface ReportStats {
  totalReports: number
  lastAnalysisDate: string | null
  successRate: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<ReportStats>({
    totalReports: 0,
    lastAnalysisDate: null,
    successRate: '—',
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Reports this month
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count: monthlyCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', firstDayOfMonth)

      // Last report date
      const { data: lastReport } = await supabase
        .from('reports')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // All reports with ml_model_result to compute success rate
      // Success = analysis.status === "Good"
      const { data: allReports } = await supabase
        .from('reports')
        .select('ml_model_result')
        .eq('user_id', user.id)
        .not('ml_model_result', 'is', null)

      let successRate = '—'
      if (allReports && allReports.length > 0) {
        const goodCount = allReports.filter(
          (r) => r.ml_model_result?.analysis?.status === 'Good'
        ).length
        successRate = `${Math.round((goodCount / allReports.length) * 100)}%`
      }

      setStats({
        totalReports: monthlyCount ?? 0,
        lastAnalysisDate: lastReport?.created_at ?? null,
        successRate,
      })

      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const displayName = profile?.full_name || user?.email || 'User'
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : displayName

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f7faf4] dark:bg-[#0e1712]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500" />
            <Leaf className="absolute inset-0 m-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 tracking-wide">
            Loading dashboard…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#f7faf4] dark:bg-[#0e1712]"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase mb-2 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Leaf className="h-3 w-3" />
              Seed Health Platform
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
              Welcome back,{' '}
              <span className="text-emerald-600 dark:text-emerald-400">{firstName}</span>!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">
              Here's an overview of your seed analysis activity this month.
            </p>
          </div>

          {/* Avatar / Initials */}
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-200 dark:ring-emerald-700 shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center ring-2 ring-emerald-300 dark:ring-emerald-600 shrink-0">
              <span className="text-white font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon={<FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            title="Reports This Month"
            value={String(stats.totalReports)}
            description="Generated in current month"
            accent="emerald"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />}
            title="Last Analysis"
            value={formatDate(stats.lastAnalysisDate)}
            description={stats.lastAnalysisDate ? 'Most recent report date' : 'No analysis yet'}
            accent="sky"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
            title="Success Rate"
            value={stats.successRate}
            description='Reports with "Good" status'
            accent="violet"
          />
        </div>

        {/* Report Generator Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 dark:border-gray-700/60 px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/40">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center shadow-sm">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Generate New Report
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analyze seed health using your hardware device
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-6">
            <ReportGenerator />
          </div>
        </div>

      </div>
    </div>
  )
}

type AccentColor = 'emerald' | 'sky' | 'violet'

const accentMap: Record<AccentColor, { wrapper: string; iconBg: string }> = {
  emerald: {
    wrapper:
      'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/50',
    iconBg:
      'bg-white dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-800',
  },
  sky: {
    wrapper:
      'bg-sky-50 border-sky-100 dark:bg-sky-950/40 dark:border-sky-800/50',
    iconBg:
      'bg-white dark:bg-sky-950/80 border border-sky-100 dark:border-sky-800',
  },
  violet: {
    wrapper:
      'bg-violet-50 border-violet-100 dark:bg-violet-950/40 dark:border-violet-800/50',
    iconBg:
      'bg-white dark:bg-violet-950/80 border border-violet-100 dark:border-violet-800',
  },
}

function StatCard({
  icon,
  title,
  value,
  description,
  accent,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
  accent: AccentColor
}) {
  const { wrapper, iconBg } = accentMap[accent]

  return (
    <div className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${wrapper}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
        {value}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
    </div>
  )
}