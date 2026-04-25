import { NextRequest, NextResponse } from 'next/server'
import { getCurrentTimestampISO } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type HardwarePayload = {
  timestamp: string
  prediction: string
  confidence: number
  mean_activity: number
  features: {
    mean: string | null
    std: string | null
    lasca: string | null
    temporal_var: string | null
    entropy: string | null
    inertia: string | null
  }
  time_series: number[]
  analysis: {
    quality: string
    status: string
    recommendation: string
  }
}

type MlRequestBody = {
  prediction: string
  confidence: number
  mean_activity: number
  features: {
    mean?: string
    std?: string
    lasca?: string
    temporal_var?: string
    entropy?: string
    inertia?: string
  }
  time_series: number[]
}

const memoryStore = new Map<string, HardwarePayload>()

function getSupabaseConfig() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return { supabaseUrl, serviceRoleKey }
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit
): Promise<T> {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(
      'Missing Supabase env vars: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  const res = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  })

  const text = await res.text()
  let parsed: any = null

  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }

  if (!res.ok) {
    throw new Error(
      typeof parsed === 'string'
        ? parsed
        : JSON.stringify(parsed ?? { status: res.status })
    )
  }

  return parsed as T
}

async function storeHardwareData(
  data: HardwarePayload,
  sessionId: string
): Promise<string | number | null> {
  const config = getSupabaseConfig()

  if (!config) {
    memoryStore.set(sessionId, data)
    return null
  }

  const inserted = await supabaseRequest<
    Array<{ id: string | number }>
  >('hardware_data', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      payload: data,
    }),
  })

  return inserted?.[0]?.id ?? null
}

async function getLatestHardwareData(
  sessionId: string
): Promise<HardwarePayload | null> {
  const config = getSupabaseConfig()

  if (!config) {
    return memoryStore.get(sessionId) ?? memoryStore.get('default') ?? null
  }

  const rows = await supabaseRequest<Array<{ payload: HardwarePayload }>>(
    `hardware_data?session_id=eq.${encodeURIComponent(
      sessionId
    )}&order=created_at.desc&limit=1&select=payload`,
    {
      method: 'GET',
    }
  )

  return rows?.[0]?.payload ?? null
}

export async function GET(request: NextRequest) {
  try {
    const sessionId =
      request.headers.get('x-session-id') ||
      request.nextUrl.searchParams.get('sessionId') ||
      'default'

    const hardwareData = await getLatestHardwareData(sessionId)

    if (!hardwareData) {
      return NextResponse.json(
        { error: 'No hardware data available', hasData: false },
        { status: 202 }
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
    const data = (await request.json()) as MlRequestBody

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

    if (!data.features || typeof data.features !== 'object') {
      return NextResponse.json(
        { error: 'Features object is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.time_series)) {
      return NextResponse.json(
        { error: 'time_series must be an array' },
        { status: 400 }
      )
    }

    const processedResult: HardwarePayload = {
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
        status: data.prediction === 'Defect' ? 'Defective' : 'Normal',
        recommendation:
          data.prediction === 'Defect'
            ? 'Item identified as defective. Further inspection recommended.'
            : 'Item passes quality checks.',
      },
    }

    const sessionId =
      request.headers.get('x-session-id') || 'default'

    const storageId = await storeHardwareData(processedResult, sessionId)

    console.log('Hardware data received and stored:', {
      storageId,
      sessionId,
      processedResult,
    })

    return NextResponse.json(
      {
        ...processedResult,
        storage_id: storageId,
        sessionId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hardware data processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process hardware data' },
      { status: 500 }
    )
  }
}