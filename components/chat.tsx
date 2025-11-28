"use client"

import React, { useEffect, useState } from 'react'
import Message from "./message"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { supabase } from "@/../lib/supabase/client"

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
      if (typeof window !== "undefined") {
        return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`
      }
    } catch {}
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    return new URL(path, base).toString()
  }

  const subscribeToOrderForProposal = async (proposalId: string) => {
    if (!proposalId) return
    const key = `order:${proposalId}`
    if (channelsRef.current.has(key)) return

    try {
      const r = await fetch(makeApiUrl(`/api/orders/proposals/${proposalId}`))
      if (r.ok) {
        const j = await r.json()
        if (j.order) setOrder(j.order)
      }
    } catch {}

    const channel = supabase
      .channel(`public:orders:proposal:${proposalId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `proposal_id=eq.${proposalId}` },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setOrder(payload.new)
          }
          if (payload.eventType === "DELETE") {
            setOrder(null)
          }
        }
      )
      .subscribe()

    channelsRef.current.set(key, channel)
  }

  useEffect(() => {
    if (!conversationId) return
    let channel: any = null

    ;(async () => {
      const me = await fetch(makeApiUrl("/api/profiles/me"))
      const meJson = await me.json()
      setProfile(meJson.profile)

      const convRes = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}`))
      const convJson = await convRes.json()
      setConversation(convJson.conversation)

      const msgs = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}/messages?limit=200`))
      const msgsJson = await msgs.json()
      setMessages(msgsJson.messages || [])

      channel = supabase
        .channel(`public:chat_messages:conversation:${conversationId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setMessages((p) => [...p, payload.new])

              if (typeof payload.new.content === "string" && payload.new.content.startsWith("PROPOSAL:")) {
                const pid = payload.new.content.split(":")[1]
                subscribeToOrderForProposal(pid)
              }
            }
            if (payload.eventType === "DELETE") {
              setMessages((p) => p.filter((m: any) => m.id !== payload.old.id))
            }
          }
        )
        .subscribe()

      const initialProposalIds = (msgsJson.messages || [])
        .map((m: any) =>
          typeof m.content === "string" && m.content.startsWith("PROPOSAL:") ? m.content.split(":")[1] : null
        )
        .filter(Boolean)

      initialProposalIds.forEach((pid: string) => subscribeToOrderForProposal(pid))
    })()

    return () => {
      if (channel) supabase.removeChannel(channel)
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch))
      channelsRef.current.clear()
    }
  }, [conversationId])

  const sendMessage = async () => {
    if (!content.trim() || !conversationId) return
    const res = await fetch(makeApiUrl(`/api/chat/conversations/${conversationId}/messages`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    })
    if (res.ok) {
      const { message } = await res.json()
      setMessages((p) => [...p, message])
      setContent("")
    }
  }

  const submitProposal = async () => {
    if (!proposalAmount || !proposalDate || !conversation?.request_id) return

    const res = await fetch(makeApiUrl("/api/chat/proposals"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: conversation.request_id,
        amount: Number(proposalAmount),
        message: proposalMessage,
        proposed_date: proposalDate
      })
    })

    if (res.ok) {
      setProposalAmount("")
      setProposalMessage("")
      setProposalDate("")
      setShowProposalForm(false)
    }
  }

  const acceptProposal = async (proposalId: string) => {
    const res = await fetch(makeApiUrl("/api/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal_id: proposalId })
    })
    if (res.ok) {
      const { order } = await res.json()
      setOrder(order)
    }
  }

  const releasePayment = async (orderId: string) => {
    const res = await fetch(makeApiUrl(`/api/orders/${orderId}/release-payment`), { method: "POST" })
    if (!res.ok) return
    const { order } = await res.json()
    setOrder(order)
    if (conversation?.request_id) {
      await fetch(makeApiUrl(`/api/requests/${conversation.request_id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED" })
      })
    }
    setReviewOrderId(orderId)
  }

  const renderMessage = (m: any) => {
    const isMe = profile && m.sender_id === profile.id
    if (typeof m.content === "string" && m.content.startsWith("PROPOSAL:")) {
      const proposalId = m.content.split(":")[1]
      return <ProposalMessage key={m.id} proposalId={proposalId} isMe={isMe} onAccept={acceptProposal} />
    }
    return <Message key={m.id} sender={isMe ? "sender" : "receiver"}>{m.content}</Message>
  }

  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <DialogTitle>{conversation ? `Chat - ${conversation.request_id}` : "Chat"}</DialogTitle>
        <div className="ml-auto">
          <Button variant="ghost" onClick={() => onClose?.()}>Fechar</Button>
        </div>
      </DialogHeader>

      <ScrollArea className="h-xl w-[775px] rounded-md border p-4">
        {order && (
          <div className="sticky top-0 mb-2">
            <Card className="border-l-4 border-l-emerald-400">
              <CardHeader>
                <CardTitle>Order</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Status: {order.payment_status || order.status}
                </div>
              </CardHeader>
              <CardContent>
                {profile?.role === "requester" && order.payment_status !== "RELEASED" && (
                  <Button onClick={() => releasePayment(order.id)}>Aprovar e liberar pagamento</Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {messages.map((m) => renderMessage(m))}
      </ScrollArea>

      <DialogFooter className="flex gap-2">
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={sendMessage}>Enviar</Button>
        <Button variant="outline" onClick={() => setShowProposalForm(true)}>Enviar Proposal</Button>
      </DialogFooter>

      {showProposalForm && (
        <div className="p-4 space-y-2">
          <Label>Valor</Label>
          <Input value={proposalAmount} onChange={(e) => setProposalAmount(e.target.value)} />

          <Label>Data</Label>
          <Input type="date" value={proposalDate} onChange={(e) => setProposalDate(e.target.value)} />

          <Label>Mensagem</Label>
          <Input value={proposalMessage} onChange={(e) => setProposalMessage(e.target.value)} />

          <div className="flex gap-2">
            <Button onClick={submitProposal}>Enviar Proposal</Button>
            <Button variant="ghost" onClick={() => setShowProposalForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}
    </DialogContent>
  )
}

function ProposalMessage({
  proposalId,
  isMe,
  onAccept
}: {
  proposalId: string
  isMe: boolean
  onAccept: (id: string) => void
}) {
  const [proposal, setProposal] = useState<any>(null)
  const propChannelRef = React.useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const url = typeof window !== "undefined"
        ? `${window.location.origin}/api/chat/proposals/${proposalId}`
        : `/api/chat/proposals/${proposalId}`

      const res = await fetch(url)
      if (!mounted || !res.ok) return
      const data = await res.json()
      setProposal(data.proposal)
    }

    load()

    propChannelRef.current = supabase
      .channel(`public:proposals:${proposalId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals", filter: `id=eq.${proposalId}` },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setProposal(payload.new)
          }
          if (payload.eventType === "DELETE") {
            setProposal(null)
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      if (propChannelRef.current) supabase.removeChannel(propChannelRef.current)
    }
  }, [proposalId])

  if (!proposal) {
    return <Message sender={isMe ? "sender" : "receiver"}>Carregando proposta...</Message>
  }

  return (
    <div className="my-2 max-w-[70%]">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">R$ {proposal.amount}</div>
            <div className="text-sm text-muted-foreground">
              Data: {new Date(proposal.proposed_date).toLocaleDateString()}
            </div>
          </div>

          {!isMe && (
            <Button onClick={() => onAccept(proposal.id)}>Aceitar proposta</Button>
          )}
        </div>

        <div className="mt-3 text-sm text-muted-foreground">{proposal.message}</div>
      </div>
    </div>
  )
}
