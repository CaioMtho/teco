"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, MessageCircle } from 'lucide-react'

type RequestLocation = {
  id: string
  title: string
  description: string
  requester_id: string
  latitude: number | null
  longitude: number | null
  created_at: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/requests')
        if (!res.ok) throw new Error(`Erro ${res.status}`)
        const payload = await res.json()
        const raw = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : [])
        const data: RequestLocation[] = raw.map((item: any) => ({
          id: String(item?.id ?? ''),
          title: String(item?.title ?? ''),
          description: String(item?.description ?? ''),
          requester_id: String(item?.requester_id ?? ''),
          latitude: typeof item?.latitude === 'number' ? item.latitude : (item?.address?.latitude ?? null),
          longitude: typeof item?.longitude === 'number' ? item.longitude : (item?.address?.longitude ?? null),
          created_at: String(item?.created_at ?? new Date().toISOString()),
        }))
        if (!mounted) return
        setRequests(data)
      } catch (err: any) {
        setError(err?.message ?? 'Erro ao carregar')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleStartChat = async (requestId: string) => {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId }),
      })
      if (!res.ok) return
      const data = await res.json()
      const id = data?.conversation?.id
      if (id) window.location.href = `/chat/${id}`
    } catch (err) {
    }
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Requisições</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/new-request">Nova Requisição</a>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{r.title}</CardTitle>
              <CardDescription>{new Date(r.created_at).toLocaleDateString('pt-BR')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">{r.description}</p>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" size="sm" onClick={() => handleStartChat(r.id)}>
                <MessageCircle className="mr-2" />Iniciar Chat
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`/requests/${r.id}`}>Ver detalhes</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
 
