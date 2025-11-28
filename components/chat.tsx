
"use client"

import React, { useEffect, useState } from 'react'
import Message from "./message"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface Props {
  conversationId?: string
  onClose?: () => void
}

export default function Chat({ conversationId, onClose }: Props) {
  const [messages, setMessages] = useState<Array<any>>([])
  const [content, setContent] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [conversation, setConversation] = useState<any>(null)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposalMessage, setProposalMessage] = useState('')
  const [proposalAmount, setProposalAmount] = useState<string>('')
  const [proposalDate, setProposalDate] = useState<string>('')
  const [order, setOrder] = useState<any>(null)
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null)
  const channelsRef = React.useRef<Map<string, any>>(new Map())

  const makeApiUrl = (path: string) => {
    try {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
      }
    } catch (e) {
      // fall through to server-side fallback
    }
    const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    return new URL(path, base).toString()
  }

  const subscribeToOrderForProposal = async (proposalId: string) => {
    if (!proposalId) return
    const key = `order:${proposalId}`
    if (channelsRef.current.has(key)) return

    // fetch existing order for this proposal (if any)
    try {
      const r = await fetch(makeApiUrl(`/api/orders/proposals/${proposalId}`))
      if (r.ok) {
        const j = await r.json()
        if (j.order) setOrder(j.order)
      }
    } catch (e) {
      console.warn('failed fetching order for proposal', proposalId, e)
    }

    const channel = supabase
      .channel(`public:orders:proposal:${proposalId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `proposal_id=eq.${proposalId}` }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setOrder(payload.new)
        }
        if (payload.eventType === 'DELETE') {
          setOrder(null)
        }
      })
      .subscribe()

    channelsRef.current.set(key, channel)
  }

  useEffect(() => {
    if (!conversationId) return

    let channel: any = null
    ;(async () => {
      const me = await fetch(makeApiUrl('/api/profiles/me'))
      const meJson = await me.json()
      setProfile(meJson.profile)

      const convRes = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}`))
      const convJson = await convRes.json()
      setConversation(convJson.conversation)

      const msgs = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}/messages?limit=200`))
      const msgsJson = await msgs.json()
      setMessages(msgsJson.messages || [])

      // subscribe to new messages via Supabase Realtime
      channel = supabase
        .channel(`public:chat_messages:conversation:${conversationId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new])
            // if the inserted message is a proposal pointer, subscribe to orders for it
            if (typeof payload.new.content === 'string' && payload.new.content.startsWith('PROPOSAL:')) {
              const pid = payload.new.content.split(':')[1]
              subscribeToOrderForProposal(pid)
            }
          }
          if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter((m: any) => m.id !== payload.old.id))
          }
        })
        .subscribe()

      // subscribe to existing proposal messages to watch orders
      const initialProposalIds = (msgsJson.messages || [])
        .map((m: any) => typeof m.content === 'string' && m.content.startsWith('PROPOSAL:') ? m.content.split(':')[1] : null)
        .filter(Boolean)

      initialProposalIds.forEach((pid: string) => subscribeToOrderForProposal(pid))
    })()

    return () => {
      if (channel) supabase.removeChannel(channel)
      // remove any proposal/order channels
      channelsRef.current.forEach((ch) => {
        supabase.removeChannel(ch)
      })
      channelsRef.current.clear()
    }
  }, [conversationId])

  const sendMessage = async () => {
    if (!content.trim() || !conversationId) return
    try {
      const res = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (!res.ok) throw new Error('failed')
      const { message } = await res.json()
      setMessages(prev => [...prev, message])
      setContent('')
    } catch (err) {
      console.error(err)
    }
  }

  const submitProposal = async () => {
    if (!proposalAmount || !proposalDate || !conversation?.request_id) return
    try {
      const res = await fetch(makeApiUrl('/api/chat/proposals'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: conversation.request_id, amount: Number(proposalAmount), message: proposalMessage, proposed_date: proposalDate })
      })
      if (!res.ok) throw new Error('proposal failed')
      const { proposal } = await res.json()

          <div className="">
            <ScrollArea className="h-xl w-auto md:w-[775px] rounded-md border p-4">

  const acceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(makeApiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId })
      })
      if (!res.ok) throw new Error('order failed')
      const { order } = await res.json()
      setOrder(order)
    } catch (err) {
      console.error(err)
    }
  }

  const releasePayment = async (orderId: string) => {
    try {
      const res = await fetch(makeApiUrl(`/api/orders/${orderId}/release-payment`), { method: 'POST' })
      if (!res.ok) throw new Error('release failed')
      const { order } = await res.json()
      setOrder(order)
      // close request
      if (conversation?.request_id) {
        await fetch(makeApiUrl(`/api/requests/${conversation.request_id}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CLOSED' })
        })
      }

      // open review modal for requester
      setReviewOrderId(orderId)
    } catch (err) {
      console.error(err)
    }
  }

  const renderMessage = (m: any) => {
    const isMe = profile && m.sender_id === profile.id
    if (typeof m.content === 'string' && m.content.startsWith('PROPOSAL:')) {
      const proposalId = m.content.split(':')[1]
      return (
        <ProposalMessage key={m.id} proposalId={proposalId} isMe={isMe} onAccept={acceptProposal} />
      )
    }

    return <Message key={m.id} sender={isMe ? 'sender' : 'receiver'}>{m.content}</Message>
  }

  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <DialogTitle>{conversation ? `Chat - ${conversation.request_id}` : 'Chat'}</DialogTitle>
        <div className="ml-auto">
          <Button variant="ghost" onClick={() => onClose && onClose()}>Fechar</Button>
        </div>
      </DialogHeader>

      <div>
        <ScrollArea className="h-xl w-[775px] rounded-md border p-4">
          {order && (
            <div className="sticky top-0 mb-2">
              <Card className="border-l-4 border-l-emerald-400">
                <CardHeader>
                  <CardTitle>Order</CardTitle>
                  <div className="text-sm text-muted-foreground">Status: {order.payment_status || order.status}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm">Order criado a partir da proposta</div>
                    </div>
                    <div>
                      {profile && profile.role === 'requester' && order.payment_status !== 'RELEASED' && (
                        <Button onClick={() => releasePayment(order.id)}>Aprovar e liberar pagamento</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {messages.map(m => renderMessage(m))}
        </ScrollArea>
      </div>

      <DialogFooter className="flex gap-2">
        <Input id="campo-mensagem" name="campo-mensagem" value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={sendMessage}>Enviar</Button>
        <Button variant="outline" onClick={() => setShowProposalForm(true)}>Enviar Proposal</Button>
      </DialogFooter>

      {showProposalForm && (
        <div className="p-4">
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input value={proposalAmount} onChange={(e) => setProposalAmount(e.target.value)} />
            <Label>Data proposta</Label>
            <Input type="date" value={proposalDate} onChange={(e) => setProposalDate(e.target.value)} />
            <Label>Mensagem</Label>
            <Input value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={submitProposal}>Enviar Proposal</Button>
              <Button variant="ghost" onClick={() => setShowProposalForm(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      <ReviewModal
        open={!!reviewOrderId}
        orderId={reviewOrderId}
        onClose={() => setReviewOrderId(null)}
      />
    </DialogContent>
  )
}

function ProposalMessage({ proposalId, isMe, onAccept }: { proposalId: string, isMe: boolean, onAccept: (id: string) => void }) {
  const [proposal, setProposal] = useState<any>(null)
  const propChannelRef = React.useRef<any>(null)

  useEffect(() => {
    let mounted = true
    const makeApiUrl = (path: string) => {
      try {
        if (typeof window !== 'undefined') {
          return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
        }
      } catch (e) {
        // fall through to server-side fallback
      }
      const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      return new URL(path, base).toString()
    }

    ;(async () => {
      const res = await fetch(makeApiUrl(`/api/chat/proposals/${proposalId}`))
      if (!res.ok) return
      const { proposal } = await res.json()
      if (!mounted) return
      setProposal(proposal)
    })()

    // subscribe to proposal updates via Supabase Realtime
    propChannelRef.current = supabase
      .channel(`public:proposals:${proposalId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals', filter: `id=eq.${proposalId}` }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setProposal(payload.new)
        }
        if (payload.eventType === 'DELETE') {
          setProposal(null)
        }
      })
      .subscribe()

          <DialogFooter className="flex w-full justify-between">
            <div>
              <Input id="campo-mensagem" className="w-fit" name="campo-mensagem" defaultValue="" />
            </div>
              <Button type="submit" className="w-fit"><ArrowRight /></Button>
            <div></div>

          </DialogFooter>
        </DialogContent>

  if (!proposal) return <Message sender={isMe ? 'sender' : 'receiver'}>Carregando proposta...</Message>

  return (
    <div className="my-2 max-w-[70%]">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">R$ {proposal.amount}</div>
            <div className="text-sm text-muted-foreground">Data: {new Date(proposal.proposed_date).toLocaleDateString()}</div>
          </div>
          <div>
            {!isMe && (
              <Button onClick={() => onAccept(proposal.id)}>Aceitar proposta</Button>
            )}
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">{proposal.message}</div>
      </div>
    </div>
  )
}