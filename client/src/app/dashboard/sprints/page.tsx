'use client'

import { api } from '@/lib/api'
import { Button } from '@/lib/material'

export default function Sprints() {
  async function testAPI() {
    const result = await api.get('sprint')
    console.log(result)
  }

  return (
    <div>
      <Button onClick={testAPI}>TESTE API</Button>
    </div>
  )
}
