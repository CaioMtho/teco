
'use client'

import Message from "../components/message"
import { Button } from "@/components/ui/button"



import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';


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

export default function Settings() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button  className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"><MessageSquare /></button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader className="flex border-b">
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>


          <div className="">
            <ScrollArea className="h-xl w-[775px] p-4 border">
   
            </ScrollArea>
          </div>


          <DialogFooter>

          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}