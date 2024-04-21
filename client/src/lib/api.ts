import axios from 'axios'

export interface GenericHttpResponse<T> {
  status: string
  response: T
  message?: string
}

export const api = axios.create({
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
