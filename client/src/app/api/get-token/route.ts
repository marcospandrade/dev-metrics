import { NextRequest, NextResponse } from 'next/server'

import jwtDecode from 'jwt-decode'
import { User } from '@/models/User.model'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    request.cookies.set('redirectTo', request.url)
    return NextResponse.json({})
    // throw new Error(`Unauthorized!`)
  }

  return NextResponse.json(token)
}
