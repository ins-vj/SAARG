'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Download, AlertCircle } from 'lucide-react'
import { HardwareDialog } from './hardware-dialog'
import { PDFViewer } from './pdf-viewer'

export function ReportGenerator() {
  const [showHardwareDialog, setShowHardwareDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hardwareData, setHardwareData] = useState<any>(null)
  const [mlResult, setMlResult] = useState<any>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateReport = async () => {
    setShowHardwareDialog(true)
    setError(null)
  }

  const handleHardwareConfirmed = async (seedDetected: boolean) => {
    if (!seedDetected) {
      setError('Please ensure the seed is properly placed in the hardware')
      return
    }

    setShowHardwareDialog(false)
    setIsProcessing(true)
    setError(null)

    try {
      // Process hardware data that will be sent from the hardware device
      // The hardware will POST to /api/ml-model endpoint with this data format
      // For now, we'll wait and process when data arrives
      await processHardwareData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process hardware data')
      setIsProcessing(false)
    }
  }

  const processHardwareData = async () => {
    try {
      // Poll the API for hardware data with a timeout of 2 minutes
      const maxAttempts = 120 // 120 attempts with 1-second intervals = 2 minutes
      let attempts = 0

      while (attempts < maxAttempts) {
        try {
          const response = await fetch('/api/ml-model', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.status === 200) {
            // Data is available
            const result = await response.json()
            const hardwareResult = result.data

            setHardwareData(hardwareResult)
            setMlResult(hardwareResult)

            // Generate PDF with hardware data
            await generatePDF(hardwareResult)
            return
          } else if (response.status === 202) {
            // Still waiting for data, continue polling
            attempts++
            // Wait 1 second before next attempt
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } else {
            throw new Error('Failed to fetch hardware data')
          }
        } catch (pollErr) {
          console.log(`Attempt ${attempts + 1}/${maxAttempts}: Waiting for hardware data...`)
          attempts++
          // Wait 1 second before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // Timeout reached - no data received from hardware
      setError('Timeout: Hardware did not send data within 2 minutes. Please check your device connection.')
      setIsProcessing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process hardware data')
      setIsProcessing(false)
    }
  }

  const generatePDF = async (hardwareResult: any) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Send with correct field names expected by the API
          image: null, // No image data for now
          mlResult: hardwareResult,
        }),
      })

      if (!response.ok) throw new Error('PDF generation failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      setIsProcessing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF')
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `seed-report-${Date.now()}.pdf`
      link.click()
    }
  }

  const handleReset = () => {
    setHardwareData(null)
    setMlResult(null)
    setPdfUrl(null)
    setError(null)
  }

  // If we have a PDF, show the viewer
  if (pdfUrl) {
    return (
      <div className="space-y-4">
        <PDFViewer url={pdfUrl} />
        <div className="flex gap-4">
          <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleReset} variant="outline">
            Generate New Report
          </Button>
        </div>
      </div>
    )
  }

  // If processing, show loader
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Waiting for hardware data...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Please ensure your hardware device has sent the data. This will timeout after 2 minutes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900 dark:text-red-200">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleGenerateReport}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Camera className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <HardwareDialog
        isOpen={showHardwareDialog}
        onClose={() => setShowHardwareDialog(false)}
        onConfirm={handleHardwareConfirmed}
      />
    </div>
  )
}
