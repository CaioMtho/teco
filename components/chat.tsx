
'use client'

import Message from "../components/message"
import { Button } from "@/components/ui/button"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from 'lucide-react';

export default function Chat() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button  className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"><MessageSquare /></button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader className="flex">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DialogTitle>nome de usuario</DialogTitle>
          </DialogHeader>


          <div className="grid gap-4">
            <ScrollArea className="h-[200px] w-[775px] rounded-md border p-4">

              <Message />
              <Message />
              <Message />
              <Message />
              
            </ScrollArea>
          </div>


          <DialogFooter>
            <Input id="campo-mensagem" name="campo-mensagem" defaultValue="" />
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}