import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { GenericHttpResponse, api } from '@/services/api';
import { User } from '@/models/User.model';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // redirect to the URL
    const redirectTo = cookies().get('redirectTo')?.value;

    const { data } = await api.post<GenericHttpResponse<User>>('auth/login', {
      code,
      state,
    });
    const redirectURL = redirectTo ?? new URL('/dashboard', 'https://devmetrics.com.br');
    const cookieExpiresInSeconds = 60 * 60 * 24 * 30; // 30 days

    return NextResponse.redirect(redirectURL, {
      headers: {
        'Set-Cookie': `token=${data.response.accessTokenEstimai}; Path=/; max-age=${cookieExpiresInSeconds}`,
      },
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }
}
