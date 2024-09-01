import { NextRequest, NextResponse } from 'next/server'

import jwtDecode from 'jwt-decode'
import { User } from '@/models/User.model'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      request.cookies.set('redirectTo', '/')
      throw new Error(`Unauthorized!`)
    }

    const user: User = jwtDecode(token)

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(error)
  }
}
