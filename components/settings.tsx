
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


export default function Settings() {
  return (


        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader className="flex border-b">
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>


          <div className="">
          <form>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"

                      required

                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required

                      />
                    </div>



                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">CEP</Label>
                      <Input
                        id="zip_code"
                        type="text"
                        placeholder="00000-000"

                        required

                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        type="text"
                        placeholder="Nome da rua"

                        required

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        type="text"
                        placeholder="123"

                        required

                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        type="text"
                        placeholder="Apto, bloco, etc (opcional)"

                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        type="text"
                        placeholder="Nome do bairro"

                        required

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Cidade"
                        required

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="UF"
                        required

                        maxLength={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="País"
                        required

                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="mt-2 w-full text-white">
                  atualizar
                </Button>


            </form>
          </div>


          <DialogFooter>

          </DialogFooter>
        </DialogContent>

  )
}