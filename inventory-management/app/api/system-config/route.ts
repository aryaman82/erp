import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system-config`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const config = await response.json()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to fetch system config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Config key is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const response = await fetch(`${API_BASE_URL}/api/system-config/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const config = await response.json()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to update system config:', error)
    return NextResponse.json(
      { error: 'Failed to update system config' },
      { status: 500 }
    )
  }
}
