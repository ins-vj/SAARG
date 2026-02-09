'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'

interface PDFViewerProps {
  url: string
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setError('No PDF URL provided')
    }
  }, [url])

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900 dark:text-red-200">Error</h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <iframe
        src={url}
        className="w-full h-96 md:h-screen"
        title="Seed Analysis Report"
        style={{ border: 'none' }}
      />
    </div>
  )
}
