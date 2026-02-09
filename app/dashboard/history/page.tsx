'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, Download, Trash2 } from 'lucide-react'

interface Report {
  id: string
  title: string
  created_at: string
  pdf_url?: string
}

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadReports = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      // TODO: Fetch reports from database
      // const { data, error } = await supabase
      //   .from('reports')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false })

      setReports([])
      setLoading(false)
    }

    loadReports()
  }, [supabase, router])

  const handleDownload = (report: Report) => {
    if (report.pdf_url) {
      const link = document.createElement('a')
      link.href = report.pdf_url
      link.download = `${report.title}.pdf`
      link.click()
    }
  }

  const handleDelete = async (reportId: string) => {
    // TODO: Delete report from database
    setReports(reports.filter((r) => r.id !== reportId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="w-8 h-8" />
          Report History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your previous reports</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reports yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate your first seed analysis report to get started
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
              >
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
