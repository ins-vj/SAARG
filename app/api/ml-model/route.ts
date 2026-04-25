import { NextRequest, NextResponse } from 'next/server'
import { getCurrentTimestampISO } from '@/lib/utils'

// Optional: force Node runtime (safe for most cases)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.prediction ||
      data.confidence === undefined ||
      data.mean_activity === undefined
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: prediction, confidence, mean_activity',
        },
        { status: 400 }
      )
    }

    // Validate features
    if (!data.features || typeof data.features !== 'object') {
      return NextResponse.json(
        { error: 'Features object is required' },
        { status: 400 }
      )
    }

    // Validate time series
    if (!Array.isArray(data.time_series)) {
      return NextResponse.json(
        { error: 'time_series must be an array' },
        { status: 400 }
      )
    }

    // Process data
    const result = {
      timestamp: getCurrentTimestampISO(),
      prediction: data.prediction,
      confidence: Math.round(data.confidence * 100),
      mean_activity: Math.round(data.mean_activity * 100),

      features: {
        mean: data.features.mean ?? null,
        std: data.features.std ?? null,
        lasca: data.features.lasca ?? null,
        temporal_var: data.features.temporal_var ?? null,
        entropy: data.features.entropy ?? null,
        inertia: data.features.inertia ?? null,
      },

      time_series: data.time_series,

      analysis: {
        quality:
          data.confidence > 0.9
            ? 'Excellent'
            : data.confidence > 0.8
            ? 'Good'
            : 'Average',

        status:
          data.prediction === 'Defect' ? 'Defective' : 'Normal',

        recommendation:
          data.prediction === 'Defect'
            ? 'Item identified as defective. Further inspection recommended.'
            : 'Item passes quality checks.',
      },
    }

    console.log('Processed ML data:', result)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Processing error:', error)

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}