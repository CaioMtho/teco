"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Rating } from './rating'

interface ReviewModalProps {
  open: boolean
  orderId: string | null
  onClose: () => void
}

export default function ReviewModal({ open, orderId, onClose }: ReviewModalProps) {
  const [rating, setRating] = React.useState<number | null>(null)
  const [comment, setComment] = React.useState<string>('')
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setRating(null)
      setComment('')
    }
  }, [open])

  const submit = async () => {
    if (!orderId) return onClose()
    setSubmitting(true)
    try {
      if (rating !== null) {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, rating: rating, comment: comment || null })
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avalie o serviço</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Classificação</Label>
            <Rating value={rating} onChange={(v) => setRating(v)} />
          </div>
          <div>
            <Label>Comentário (opcional)</Label>
            <Input value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Pular</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar avaliação'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
