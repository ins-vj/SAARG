import { NextRequest, NextResponse } from 'next/server'
import { storeHardwareData, getLatestHardwareData } from '../hardware-data-store'
import { getCurrentTimestampISO } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // Retrieve the latest hardware data that was POSTed
    const hardwareData = getLatestHardwareData()

    if (!hardwareData) {
      return NextResponse.json(
        { error: 'No hardware data available', hasData: false },
        { status: 202 } // 202 Accepted - processing, no data yet
      )
    }

    return NextResponse.json(
      { data: hardwareData, hasData: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hardware data retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve hardware data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required hardware parameters
    if (!data.prediction || data.confidence === undefined || data.mean_activity === undefined) {
      return NextResponse.json(
        { error: 'Missing required hardware parameters: prediction, confidence, mean_activity' },
        { status: 400 }
      )
    }

    // Validate features object
    if (!data.features || typeof data.features !== 'object') {
      return NextResponse.json(
        { error: 'Features object is required' },
        { status: 400 }
      )
    }

    // Validate time_series array
    if (!Array.isArray(data.time_series)) {
      return NextResponse.json(
        { error: 'Time series data must be an array' },
        { status: 400 }
      )
    }

    // Process hardware data
    const processedResult = {
      timestamp: getCurrentTimestampISO(),
      prediction: data.prediction,
      confidence: Math.round(data.confidence * 100),
      mean_activity: Math.round(data.mean_activity * 100),
      features: {
        mean: data.features.mean || null,
        std: data.features.std || null,
        lasca: data.features.lasca || null,
        temporal_var: data.features.temporal_var || null,
        entropy: data.features.entropy || null,
        inertia: data.features.inertia || null,
      },
      time_series: data.time_series,
      analysis: {
        quality: data.confidence > 0.9 ? 'Excellent' : data.confidence > 0.8 ? 'Good' : 'Average',
        status: data.prediction === 'Defect' ? 'Defective' : 'Normal',
        recommendation: data.prediction === 'Defect' 
          ? 'Item identified as defective. Further inspection recommended.' 
          : 'Item passes quality checks.',
      },
    }

    // Store the hardware data for frontend to retrieve
    const sessionId = request.headers.get('x-session-id') || 'default'
    storeHardwareData(processedResult, sessionId)

    console.log('Hardware data received and stored:', processedResult)

    return NextResponse.json(processedResult)
  } catch (error) {
    console.error('Hardware data processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process hardware data' },
      { status: 500 }
    )
  }
}
