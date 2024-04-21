import { cookies } from 'next/headers'

import jwtDecode from 'jwt-decode'

import { User } from '@/models/User.model'

export function getUser() {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthorized!')
  }

  const user: User = jwtDecode(token)

  return user
}
