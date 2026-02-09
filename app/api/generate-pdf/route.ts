import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { image, mlResult } = await request.json()

    // Get authenticated user
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Add title
    pdf.setFontSize(20)
    pdf.text('Seed Health Analysis Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Add timestamp
    pdf.setFontSize(10)
    pdf.setTextColor(100)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, {
      align: 'center',
    })
    yPosition += 15

    // Add captured image
    if (image) {
      try {
        pdf.addImage(image, 'JPEG', 20, yPosition, 170, 100)
        yPosition += 110
      } catch (err) {
        console.error('Error adding image to PDF:', err)
      }
    }

    // Add ML results
    pdf.setTextColor(0)
    pdf.setFontSize(12)
    pdf.text('Analysis Results:', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    if (mlResult) {
      // Display ML model results
      const resultText = [
        `Health Score: ${mlResult.healthScore || 'N/A'}%`,
        `Quality: ${mlResult.quality || 'N/A'}`,
        `Germination Rate: ${mlResult.germinationRate || 'N/A'}%`,
        `Moisture Level: ${mlResult.moistureLevel || 'N/A'}%`,
        `Status: ${mlResult.status || 'Healthy'}`,
      ]

      resultText.forEach((text) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(text, 20, yPosition)
        yPosition += 8
      })
    }

    // Add footer
    yPosition = pageHeight - 10
    pdf.setFontSize(8)
    pdf.setTextColor(150)
    pdf.text('FarmReport - Advanced Seed Health Analysis System', pageWidth / 2, yPosition, {
      align: 'center',
    })

    // Generate PDF as bytes
    const pdfBytes = pdf.output('arraybuffer')

    // Save report to database
    try {
      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title: `Seed Analysis Report - ${new Date().toLocaleDateString()}`,
          image_data: image,
          ml_model_result: mlResult,
          pdf_url: null, // Could upload to storage and save URL later
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database save error:', dbError)
      } else {
        console.log('Report saved to database:', reportData)
      }
    } catch (dbError) {
      console.error('Failed to save to database:', dbError)
      // Don't block PDF generation if database save fails
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="seed-report-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
