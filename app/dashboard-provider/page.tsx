"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import CalendarProvider from "components/calendar-provider";
import GainProvider from "components/gain-provider";
import SettingsProvider from "components/settings-provider";

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const InteractiveMap = dynamic(
  () =>
    import("@/../components/interactive-map").then((mod) => ({
      default: mod.InteractiveMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    ),
  }
);

const Chat = dynamic(
  () => import("@/../components/chat").then((mod) => ({ default: mod.default })),
  { ssr: false }
);

export default function DashboardProvider() {
  const [openChatFor, setOpenChatFor] = React.useState<string | null>(null);

  const handleStartChat = async (requestId: string) => {
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (!res.ok) {
        console.error("Erro ao criar conversa", await res.text());
        return;
      }

      const data = await res.json();
      setOpenChatFor(data.conversation.id);
    } catch (err) {
      console.error("Erro ao iniciar chat", err);
    }
  };

  return (
    <div className="h-screen w-full relative">
      
      {/* Mapa interativo */}
      <InteractiveMap onStartChat={handleStartChat} />

      <div>
        <Sheet>
          <div className="absolute right-0 z-100 h-2/3 top-[50px]">
            <SheetTrigger asChild>
              <button className="bg-white h-full px-2 rounded-l-lg outline outline-1 outline-gray-300">
                <ArrowLeft />
              </button>
            </SheetTrigger>
          </div>

          <SheetContent>
            <SheetHeader />

            <div className="mx-auto w-full sm:w-auto">
              <Image
                src="/user-icon.png"
                alt="icone"
                className="size-48 mt-3 mx-auto bg-gray-300 rounded-full"
                width={64}
                height={64}
              />

              <h2 className="text-2xl text-center mt-2">nome do usuário</h2>

              <div className="flex items-stretch mt-6 gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-16 px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                      Calendário
                    </button>
                  </DialogTrigger>
                  <CalendarProvider />
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-16 px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                      Análise de ganhos
                    </button>
                  </DialogTrigger>
                  <GainProvider />
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-16 px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                      Configurações
                    </button>
                  </DialogTrigger>
                  <SettingsProvider />
                </Dialog>
              </div>

              <div className="mt-6 flex items-center">
                <Search className="m-1" />
                <input
                  type="search"
                  className="h-10 px-1 w-full bg-gray-200 text-gray-800 border-0 rounded-sm"
                  name="search"
                />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Fechar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {openChatFor && (
        <div className="fixed right-0 bottom-0 md:right-6 md:bottom-6 z-50 w-full md:w-96 h-screen md:h-[520px] bg-white border rounded-none md:rounded-lg shadow-lg overflow-hidden">
          <Chat conversationId={openChatFor} onClose={() => setOpenChatFor(null)} />
        </div>
      )}
    </div>
  );
}
