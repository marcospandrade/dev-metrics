import axios from 'axios'
import { cookies } from 'next/headers'
import { getUser } from '../lib/auth'
import { User } from '@/models/User.model'

export interface GenericHttpResponse<T> {
  status: string
  response: T
  message?: string
}

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const localApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  async (config) => {
    const { data } = await localApi.get<User>('api/get-token')

    if (data) {
      config.headers['Authorization'] = `Bearer ${data}`
    }
    return config
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(new Error(error))
  }
)

export const api = axiosInterceptorInstance
