
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
import { ArrowRight } from 'lucide-react';

export default function Chat() {
  return (


        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader className="flex">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DialogTitle>nome de usuario</DialogTitle>
          </DialogHeader>


          <div className="">
            <ScrollArea className="h-xl w-auto md:w-[775px] rounded-md border p-4">

              <Message sender="sender"> Lorem</Message>
              <Message sender="sender"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti at sequi, doloremque nisi mollitia porro, neque reiciendis rerum quo ea non distinctio aliquam quod culpa. Officia, quidem? At, omnis quibusdam.</Message>
              <Message sender="receiver"> fgasrgaegeg</Message>


              
            </ScrollArea>
          </div>


          <DialogFooter className="flex w-full justify-between">
            <div>
              <Input id="campo-mensagem" className="w-fit" name="campo-mensagem" defaultValue="" />
            </div>
              <Button type="submit" className="w-fit"><ArrowRight /></Button>
            <div></div>

          </DialogFooter>
        </DialogContent>

  )
}