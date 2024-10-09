import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    request.cookies.set('redirectTo', request.url)
    return NextResponse.json({})
    // throw new Error(`Unauthorized!`)
  }

  return NextResponse.json(token)
}
