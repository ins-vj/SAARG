import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatDateTimeIST, formatDateOnlyIST, getCurrentTimestampISO } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Helper: render a consistent footer on any page
// ─────────────────────────────────────────────────────────────
function addPageFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  white: string,
  slate900: string,
  emerald600: string,
  amber400: string,
  slate100: string
) {
  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  })
  const setFill = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)
    pdf.setFillColor(r, g, b)
  }
  const setTextCol = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)
    pdf.setTextColor(r, g, b)
  }

  // Footer band
  setFill(slate900)
  pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F')

  // Amber rule at very bottom
  setFill(amber400)
  pdf.rect(0, pageHeight - 1.5, pageWidth, 1.5, 'F')

  // Footer text
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  setTextCol(white)
  pdf.text('SAARG — Advanced Seed Health Analysis System', pageWidth / 2, pageHeight - 4.5, {
    align: 'center',
  })
}

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

    // ─────────────────────────────────────────────────────────
    // CREATE PDF
    // ─────────────────────────────────────────────────────────
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth  = pdf.internal.pageSize.getWidth()   // 210
    const pageHeight = pdf.internal.pageSize.getHeight()  // 297

    // ── Colour palette ────────────────────────────────────────
    const slate900   = '#0F172A'
    const slate700   = '#334155'
    const slate100   = '#F1F5F9'
    const slate200   = '#E2E8F0'
    const emerald600 = '#059669'
    const emerald100 = '#D1FAE5'
    const emerald500 = '#10B981'
    const amber400   = '#FBBF24'
    const white      = '#FFFFFF'
    const bodyText   = '#1E293B'
    const mutedText  = '#64748B'

    // ── Colour helpers ────────────────────────────────────────
    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    })
    const setFill = (hex: string) => {
      const { r, g, b } = hexToRgb(hex)
      pdf.setFillColor(r, g, b)
    }
    const setDraw = (hex: string) => {
      const { r, g, b } = hexToRgb(hex)
      pdf.setDrawColor(r, g, b)
    }
    const setTextCol = (hex: string) => {
      const { r, g, b } = hexToRgb(hex)
      pdf.setTextColor(r, g, b)
    }

    // ─────────────────────────────────────────────────────────
    // HEADER  —  dark full-width bar with brand name + title
    // ─────────────────────────────────────────────────────────

    // Main dark header band
    setFill(slate900)
    pdf.rect(0, 0, pageWidth, 44, 'F')

    // Amber accent rule at very top
    setFill(amber400)
    pdf.rect(0, 0, pageWidth, 2, 'F')

    // Emerald left margin stripe
    setFill(emerald600)
    pdf.rect(0, 2, 5, 42, 'F')

    // Brand name
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(22)
    setTextCol(white)
    pdf.text('SAARG', 14, 20)

    // // Separator dot
    // pdf.setFontSize(9)
    // setTextCol(emerald500)
    // pdf.text('●', 47, 20)

    // Product tagline next to dot
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    setTextCol(slate700)
    pdf.text('Seed Analyzer And Report Generator', 52, 20)

    // Report title on second line
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    setTextCol(amber400)
    pdf.text('Seed Health Analysis Report', 14, 33)

    // Generated timestamp flush right
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.5)
    setTextCol(slate700)
    const genLabel = `Generated: ${formatDateTimeIST(new Date())}`
    pdf.text(genLabel, pageWidth - 8, 33, { align: 'right' })

    // ─────────────────────────────────────────────────────────
    // SUBHEADER DIVIDER  (thin emerald rule + light band)
    // ─────────────────────────────────────────────────────────
    setFill(emerald100)
    pdf.rect(0, 44, pageWidth, 10, 'F')

    setFill(emerald600)
    pdf.rect(0, 44, pageWidth, 0.8, 'F')    // top rule
    pdf.rect(0, 53.2, pageWidth, 0.8, 'F')  // bottom rule

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.5)
    setTextCol(emerald600)
    pdf.text('Advanced Seed Diagnostics  ·  Powered by ML', 14, 50)

    // ─────────────────────────────────────────────────────────
    // BODY AREA
    // ─────────────────────────────────────────────────────────
    let yPosition = 64

    // ── Seed Image Card ───────────────────────────────────────
    if (image) {
      try {
        // Section label row
        setFill(slate100)
        pdf.rect(14, yPosition - 1, pageWidth - 28, 8, 'F')
        setFill(emerald600)
        pdf.rect(14, yPosition - 1, 3, 8, 'F')

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8)
        setTextCol(bodyText)
        pdf.text('CAPTURED SEED SAMPLE', 21, yPosition + 4.5)
        yPosition += 12

        // Image card — clean white rect with subtle border
        const imgX = 14
        const imgW = pageWidth - 28
        const imgH = 88

        setFill(white)
        setDraw(slate200)
        pdf.setLineWidth(0.4)
        pdf.rect(imgX, yPosition, imgW, imgH, 'FD')

        // 2 mm inset so the image does not touch the border
        pdf.addImage(image, 'JPEG', imgX + 2, yPosition + 2, imgW - 4, imgH - 4)
        yPosition += imgH + 10
      } catch (err) {
        console.error('Error adding image:', err)
        yPosition += 4
      }
    }

    // ── Analysis Results ──────────────────────────────────────
    if (mlResult) {
      // Section label row
      setFill(slate100)
      pdf.rect(14, yPosition - 1, pageWidth - 28, 8, 'F')
      setFill(emerald600)
      pdf.rect(14, yPosition - 1, 3, 8, 'F')

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      setTextCol(bodyText)
      pdf.text('ANALYSIS RESULTS', 21, yPosition + 4.5)
      yPosition += 12

      const metrics = [
        { label: 'Health Score',     value: `${mlResult.confidence || 'N/A'}%`                            },
        { label: 'Quality',          value: `${mlResult.analysis?.quality || 'N/A'}`                      },
        { label: 'Germination Rate', value: `${mlResult.mean_activity || 'N/A'}%`                         },
        { label: 'Prediction',       value: `${mlResult.prediction || 'N/A'}`                             },
        { label: 'Status',           value: `${mlResult.analysis?.status || 'Healthy'}`                   },
        { label: 'Recommendation',   value: `${mlResult.analysis?.recommendation || 'No recommendation'}` },
      ]

      const cardX     = 14
      const cardW     = pageWidth - 28
      const rowH      = 12
      const labelColW = 50

      metrics.forEach((metric, i) => {
        if (yPosition + rowH > pageHeight - 22) {
          addPageFooter(pdf, pageWidth, pageHeight, white, slate900, emerald600, amber400, slate100)
          pdf.addPage()
          yPosition = 20
        }

        const isEven = i % 2 === 0

        // Row background
        setFill(isEven ? '#F8FAFC' : white)
        setDraw(slate200)
        pdf.setLineWidth(0.25)
        pdf.rect(cardX, yPosition, cardW, rowH, 'FD')

        // Left colour pip
        setFill(isEven ? emerald600 : emerald500)
        pdf.rect(cardX, yPosition, 3, rowH, 'F')

        // Label
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8)
        setTextCol(bodyText)
        pdf.text(metric.label, cardX + 8, yPosition + rowH / 2 + 2.2)

        // Vertical divider between label and value
        setDraw(slate200)
        pdf.setLineWidth(0.25)
        pdf.line(cardX + labelColW, yPosition + 2, cardX + labelColW, yPosition + rowH - 2)

        // Value — wrap if long
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        setTextCol(mutedText)
        const valueX     = cardX + labelColW + 4
        const maxValueW  = cardW - labelColW - 8
        const valueLines = pdf.splitTextToSize(String(metric.value), maxValueW)
        pdf.text(valueLines[0], valueX, yPosition + rowH / 2 + 2.2)

        yPosition += rowH
      })

      yPosition += 8
    }

    // ─────────────────────────────────────────────────────────
    // FOOTER  (last page)
    // ─────────────────────────────────────────────────────────
    addPageFooter(pdf, pageWidth, pageHeight, white, slate900, emerald600, amber400, slate100)

    // ─────────────────────────────────────────────────────────
    // GENERATE PDF BYTES
    // ─────────────────────────────────────────────────────────
    const pdfBytes = pdf.output('arraybuffer')

    // ================= STORAGE UPLOAD =================
    let pdfUrl: string | null = null

    try {
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

    // ================= DB SAVE =================
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