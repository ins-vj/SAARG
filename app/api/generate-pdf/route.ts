import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatDateTimeIST, formatDateOnlyIST, getCurrentTimestampISO } from '@/lib/utils'

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

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    pdf.setFontSize(20)
    pdf.text('Seed Health Analysis Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    pdf.setFontSize(10)
    pdf.setTextColor(100)
    pdf.text(`Generated: ${formatDateTimeIST(new Date())}`, pageWidth / 2, yPosition, {
      align: 'center',
    })
    yPosition += 15

    if (image) {
      try {
        pdf.addImage(image, 'JPEG', 20, yPosition, 170, 100)
        yPosition += 110
      } catch (err) {
        console.error('Error adding image:', err)
      }
    }

    pdf.setTextColor(0)
    pdf.setFontSize(12)
    pdf.text('Analysis Results:', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(10)

    if (mlResult) {
      const resultText = [
        `Health Score: ${mlResult.confidence || 'N/A'}%`,
        `Quality: ${mlResult.analysis?.quality || 'N/A'}`,
        `Germination Rate: ${mlResult.mean_activity || 'N/A'}%`,
        `Prediction: ${mlResult.prediction || 'N/A'}`,
        `Status: ${mlResult.analysis?.status || 'Healthy'}`,
        `Recommendation: ${mlResult.analysis?.recommendation || 'No recommendation'}`,
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

    // Footer
    yPosition = pageHeight - 10
    pdf.setFontSize(8)
    pdf.setTextColor(150)
    pdf.text('FarmReport - Advanced Seed Health Analysis System', pageWidth / 2, yPosition, {
      align: 'center',
    })

    // Generate PDF
    const pdfBytes = pdf.output('arraybuffer')

    // ================= FIXED STORAGE PART =================
    let pdfUrl: string | null = null

    try {
      // ✅ FIX: removed extra "reports/" prefix
      const fileName = `${user.id}/seed-report-${Date.now()}.pdf`

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('saarg_report_pdf')
        .upload(fileName, new Blob([pdfBytes], { type: 'application/pdf' }), {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
      } else {
        const { data } = supabase
          .storage
          .from('saarg_report_pdf')
          .getPublicUrl(fileName)
        
        pdfUrl = data.publicUrl
        console.log('PDF uploaded:', pdfUrl)
      }
    } catch (storageError) {
      console.error('Storage exception:', storageError)
    }

    // ================= DB SAVE (UNCHANGED) =================
    try {
      const { data: reportData, error: dbError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title: `Seed Analysis Report - ${formatDateOnlyIST(new Date())}`,
          image_data: image,
          ml_model_result: mlResult,
          pdf_url: pdfUrl,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database save error:', dbError)
      } else {
        console.log('Report saved:', reportData)
      }
    } catch (dbError) {
      console.error('DB exception:', dbError)
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