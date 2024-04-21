import { NextRequest, NextResponse } from 'next/server'

import { GenericHttpResponse, api } from '@/lib/api'
import { User } from '@/models/User.model'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  console.log('search params', searchParams)

  // redirect to the URL
  const redirectTo = request.cookies.get('redirectTo')?.value

  const { data } = await api.post<GenericHttpResponse<User>>('auth/login', {
    code,
    state,
  })

  const redirectURL = redirectTo ?? new URL('/dashboard', request.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30 // 30 days

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${data.response.accessTokenEstimai}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
