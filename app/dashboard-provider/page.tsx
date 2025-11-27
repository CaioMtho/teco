"use client";
import React from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import CalendarProvider from "components/calendar-provider"
import GainProvider from "components/gain-provider"
import SettingsProvider from "components/settings-provider"

import { Bolt } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Search } from 'lucide-react';

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

const InteractiveMap = dynamic(
    () => import('@/../components/interactive-map').then(mod => ({ default: mod.InteractiveMap })),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen w-full flex items-center justify-center bg-neutral-50">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        )
    }
);
const Chat = dynamic(
  () => import('@/../components/chat').then(mod => ({ default: mod.default })),
  { ssr: false }
);

export default function DashboardProvider() {
    const router = useRouter();
    const [openChatFor, setOpenChatFor] = React.useState<string | null>(null);

    const handleStartChat = async (requestId: string) => {
      try {
        const res = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_id: requestId })
        })

        if (!res.ok) {
          console.error('Erro ao criar conversa', await res.text())
          return
        }

        const data = await res.json()
        setOpenChatFor(data.conversation.id)
      } catch (err) {
        console.error('Erro ao iniciar chat', err)
      }
    };

    // Sidebar content (extract to reuse for mobile sheet)
    const sidebarContent = (
      <div className='mx-auto w-full sm:w-auto p-4'>
        <Image
          src="/user-icon.png"
          alt="icone"
          className="size-48 mt-3 mx-auto bg-gray-300 rounded-full"
          width={64}
          height={64}
        />
        <h2 className='text-2xl text-center mt-2'>nome do usuário</h2>
        <div className='flex flex-col sm:flex-row items-stretch gap-2 mt-6'>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <button className="h-12 px-3 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">Calendário</button>
              </DialogTrigger>
              <CalendarProvider />
            </form>
          </Dialog>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <button className="h-12 px-3 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">Análise de ganhos</button>
              </DialogTrigger>
              <GainProvider />
            </form>
          </Dialog>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <button className="h-12 px-3 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">Configurações</button>
              </DialogTrigger>
              <SettingsProvider />
            </form>
          </Dialog>
        </div>

        <div className='mt-6 flex items-center'>
          <div className='m-1'><Search /></div>
          <input type="search" className="h-10 px-2 w-full bg-gray-100 text-gray-800 border-0 rounded-sm " name="search" placeholder="Buscar" />
        </div>
      </div>
    )

    return (
      <div className="min-h-screen w-full relative bg-white">
        {/* Top bar */}
        <header className="w-full border-b bg-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-md hover:bg-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">Painel de Prestador</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <Input placeholder="Buscar" />
            </div>
            <Button variant="ghost">Perfil</Button>
          </div>
        </header>

        {/* Main content: map + desktop sidebar */}
        <main className="w-full h-[calc(100vh-64px)] flex">
          <section className="flex-1 h-full">
            <InteractiveMap onStartChat={handleStartChat} />
          </section>

          {/* Desktop sidebar - visible on sm and up */}
          <aside className="hidden sm:block w-80 border-l bg-neutral-50">
            {sidebarContent}
          </aside>
        </main>

        {/* Mobile sheet for sidebar */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center">
                <Bolt />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Opções rápidas</SheetDescription>
              </SheetHeader>
              {sidebarContent}
              <SheetFooter />
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat panel - rendered when a conversation is open */}
        {openChatFor && (
          <div className="fixed right-6 bottom-6 z-50 w-96 h-[520px] bg-white border rounded-lg shadow-lg overflow-hidden">
            <Chat conversationId={openChatFor} onClose={() => setOpenChatFor(null)} />
          </div>
        )}
      </div>
    )
}
