import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check - if this endpoint responds, the backend is working
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Backend is operational'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Backend health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
