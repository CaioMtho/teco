'use client'

import Image from 'next/image'
import { supabase } from 'lib/supabase/client'
import Modal from '../../components/modal'
import { useModal } from '../../hooks/use-modal'

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
    <div className="">
      <h1 className='text-5xl pb-3 pt-9 ps-6'>Dashboard</h1>
      <div id="dashboard" className="bg-white border-2 border-gray-200 rounded-lg m-12 mx-auto w-200 py-6">
        <h2 className='ml-9 text-2xl'>nome do usuário</h2>
        <div className="flex mx-6 my-3 p-3">
          <Image 
            src="/user-icon.png"
            alt="icone"
            className="my-auto w-42 h-42 bg-gray-300 rounded-xl"
            width={64}
            height={64}
          />
          <div className='flex flex-col ml-3 w-full'>
            <label>email:</label>
            <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3' />
            <label>telefone:</label>
            <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3' />
            <label>endereço:</label>
            <input type="text" disabled className='w-full bg-gray-200 rounded-md h-6 mb-3' />
          </div>
        </div>
        <div className="flex justify-end px-6 mt-6">
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
