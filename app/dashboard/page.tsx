'use client'

import Image from 'next/image'
import { supabase } from 'lib/supabase/client'
import Modal from '../../components/modal'
import { useModal } from '../../hooks/use-modal'
import Chat from "components/chat"
import Settings from "components/settings"
import { Bolt } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

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

export default function Page() {
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

  return (
    <div className="h-full  overflow-x-hidden overflow-y-auto">
      <h1 className='text-5xl pb-3 pt-6 ps-6'>Dashboard</h1>
      <div id="dashboard" className="bg-white border-2 border-gray-200 rounded-sm mx-2 my-2 py-3 mb-12 sm:mx-24 flex flex-wrap h-lvh sm:h-full overflow-hidden">
        <div id="left-side" className='ml-6'>
        
        <div className=''>
          <Image 
            src="/user-icon.png"
            alt="icone"
            className="size-64 min-w-64 min-size-64 shrink-0 object-cover mt-3 bg-gray-300 rounded-xl"
            width={64}
            height={64}
          />
          <h2 className='text-2xl'>nome do usuário</h2>
          <div className='flex justify-center'>

              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <button  className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"><MessageSquare /></button>
                  </DialogTrigger>
                   <Chat/>
                  </form>
              </Dialog>

              <Dialog>
                <form>
                  <DialogTrigger asChild>
                  <button  className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"><Bolt /></button>
                  </DialogTrigger>
                  <Settings/>
                </form>
              </Dialog>
       
          </div>
        </div>

      </div>
      <div className='flex-col mb-12 ms-6 h-lh'>
        <div className='justify-self-center self-center my-12 ms-6 text-md sm:text-lg text-wrap'>
           se conecte com técnicos de informática qualificados para resolver os seus problemas

        </div>
        <div className='self-end mt-24'>
          <p className='text-gray-700'>mensagens recentes:</p>
          <div className='flex flex-wrap'>
            <div className='bg-gray-200 w-md h-32 border rounded-md'>
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <button  className="flex flex-col p-2 w-full h-32 bg-white text-black rounded-md border justify-start items-start border-gray-300 hover:bg-gray-100 transition-colors">
                      <h3 className='text-gray-800'>nome de usuario</h3>
                      <p className='text-gray-500'>mensagem recente</p>
                    </button>
                  </DialogTrigger>
                   <Chat/>
                  </form>
              </Dialog>

            </div>
            <div className='bg-gray-200 w-md h-32 ms-2 border rounded-md'>
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <button  className="flex flex-col p-2 w-full h-32 bg-white text-black rounded-md border justify-start items-start border-gray-300 hover:bg-gray-100 transition-colors">
                      <h3 className='text-gray-800'>nome de usuario</h3>
                      <p className='text-gray-500'>mensagem recente</p>
                    </button>
                  </DialogTrigger>
                   <Chat/>
                  </form>
              </Dialog>

            </div>

          </div>
        </div>
      </div>
        <div className="ms-auto me-2">
          <button
            onClick={confirmSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
        

      </div>

      <Modal {...modalState} onClose={closeModal} />
    </div>
  )
}

