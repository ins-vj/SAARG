'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Camera, Download, AlertCircle } from 'lucide-react'
import { HardwareDialog } from './hardware-dialog'
import { PDFViewer } from './pdf-viewer'

export function ReportGenerator() {
  const [showHardwareDialog, setShowHardwareDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [mlResult, setMlResult] = useState<any>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

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
      // Start camera capture
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoRef.current.srcObject = stream

        // Wait for video to load
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = resolve
        })

        // Capture image after 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000))

        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0)
            const imageData = canvasRef.current.toDataURL('image/jpeg')
            setCapturedImage(imageData)

            // Stop the stream
            stream.getTracks().forEach((track) => track.stop())

            // Call ML model API
            await callMLModel(imageData)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture image')
      setIsProcessing(false)
    }
  }

  const callMLModel = async (imageData: string) => {
    try {
      // Replace with your actual ML model endpoint
      const response = await fetch('/api/ml-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
        }),
      })

      if (!response.ok) throw new Error('ML model processing failed')

      const result = await response.json()
      setMlResult(result)

      // Generate PDF
      await generatePDF(imageData, result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process with ML model')
      setIsProcessing(false)
    }
  }

  const generatePDF = async (imageData: string, mlResult: any) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          mlResult: mlResult,
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
    setCapturedImage(null)
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
        <p className="text-gray-600 dark:text-gray-400">Processing seed analysis...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          This may take a few moments. Do not close the page.
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

      {/* Hidden elements for camera capture */}
      <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />

      <HardwareDialog
        isOpen={showHardwareDialog}
        onClose={() => setShowHardwareDialog(false)}
        onConfirm={handleHardwareConfirmed}
      />
    </div>
  )
}
