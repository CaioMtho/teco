'use client'
import { useEffect, useState } from 'react'
import { supabase } from 'lib/supabase/client'

import Link from 'next/link'
import Image from 'next/image'

import Modal from '../../components/modal'
import { useModal } from '../../hooks/use-modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function MenuPopover() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      try {
        const res = await fetch('/api/profiles/me')
        const json = await res.json()
        console.log("lolo-" + JSON.stringify(json))
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
      }
    }

    load()
  }, [])

  const { modalState, closeModal, showConfirm, showSuccess, showError } = useModal()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      showError('Erro ao sair', error.message)
    } else {
      showSuccess('Sessão encerrada', 'Você foi desconectado com sucesso.')
      window.location.href = '/login'
    }
  }

  const confirmSignOut = () => {
    showConfirm(
      'Deseja sair?',
      'Tem certeza que deseja encerrar sua sessão?',
      handleSignOut,
      'Sair',
      'Cancelar'
    )
  }

  if (!user) return <div></div>

  return (
    <div className="mx-3 ms-auto sm:mx-12">
      <Popover>
        <PopoverTrigger asChild>
          <Image
            src="/user-icon.png"
            alt="icone"
            className="w-12 h-12 min-w-12 self-center shrink-0 object-cover"
            width={64}
            height={64}
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit flex flex-col text-center z-4000">
          <Link href="/" className="p-1 border-b border-gray-200 font-medium">Inicio</Link>
          <Link href="/about" className="p-1 border-b border-gray-200 font-medium">Sobre</Link>
          <Link href="/dashboard" className="p-1 border-b border-gray-200 font-medium">Dashboard</Link>
          <Link href="/new-request" className="p-1 border-b border-gray-200 font-medium">Requisições</Link>

          <button onClick={confirmSignOut} className="px-4 py-2 text-[#FF0000] hover:bg-gray-100">
            Sair
          </button>
        </PopoverContent>
      </Popover>

      <Modal {...modalState} onClose={closeModal} />
    </div>
  )
}
