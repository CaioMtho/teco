"use client"

import React from 'react'
import { Star } from 'lucide-react'

export function Rating({ value, onChange }: { value: number | null, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`Rate ${n}`}>
          <Star className={`h-6 w-6 ${value && value >= n ? 'text-yellow-400' : 'text-neutral-300'}`} />
        </button>
      ))}
    </div>
  )
}

export default Rating
