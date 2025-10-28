"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Modal from './modal'
import { useModal } from '../hooks/use-modal'

interface FormData {
  title: string
  description: string
  photos: File[]
}

export default function RequestForm(): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    photos: []
  })

  const [dragOver, setDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { modalState, closeModal, showSuccess, showError, showConfirm, showWarning } = useModal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 10 * 1024 * 1024
    const maxFiles = 5

    const invalidFiles = files.filter(file => file.size > maxSize)
    if (invalidFiles.length > 0) {
      showWarning(
        'Arquivos Muito Grandes',
        `${invalidFiles.length} arquivo(s) excedem o limite de 10MB e foram ignorados.`
      )
    }

    const validFiles = files.filter(file => file.size <= maxSize)

    if (formData.photos.length + validFiles.length > maxFiles) {
      showWarning(
        'Limite de Arquivos',
        `Você pode anexar no máximo ${maxFiles} fotos. Alguns arquivos foram ignorados.`
      )
      const availableSlots = maxFiles - formData.photos.length
      const filesToAdd = validFiles.slice(0, availableSlots)
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...filesToAdd]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles]
      }))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)

    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length !== files.length) {
      showWarning('Arquivos Inválidos', 'Apenas imagens são aceitas (PNG, JPG, GIF).')
    }
  }

  const removePhoto = (index: number) => {
    const photo = formData.photos[index]
    showConfirm(
      'Remover Foto',
      `Deseja remover a foto "${photo.name}"?`,
      () => {
        setFormData(prev => ({
          ...prev,
          photos: prev.photos.filter((_, i) => i !== index)
        }))
      }
    )
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      showError('Campo Obrigatório', 'Por favor, preencha o título da solicitação.')
      return false
    }

    if (formData.title.trim().length < 10) {
      showError('Título Muito Curto', 'O título deve ter pelo menos 10 caracteres.')
      return false
    }

    if (!formData.description.trim()) {
      showError('Campo Obrigatório', 'Por favor, descreva o problema que você está enfrentando.')
      return false
    }

    if (formData.description.trim().length < 20) {
      showError('Descrição Muito Curta', 'A descrição deve ter pelo menos 20 caracteres para melhor atendimento.')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const photoCount = formData.photos.length
    const photoText = photoCount > 0 ? `\n\n${photoCount} foto(s) anexada(s)` : ''

    showConfirm(
      'Confirmar Solicitação',
      `Deseja criar a solicitação "${formData.title}"?${photoText}\n\nApós a confirmação, profissionais poderão visualizar e enviar propostas.`,
      async () => {
        setIsSubmitting(true)

        try {
          await new Promise(resolve => setTimeout(resolve, 2000))

          if (true) {
            showSuccess(
              'Solicitação Criada com Sucesso!',
              'Sua solicitação foi publicada. Você receberá notificações quando profissionais enviarem propostas.'
            )

            setFormData({
              title: '',
              description: '',
              photos: []
            })
          } else {
            showError(
              'Erro ao Criar Solicitação',
              'Ocorreu um erro inesperado. Tente novamente em alguns instantes.'
            )
          }
        } catch (error) {
          showError('Erro de Conexão', 'Verifique sua conexão com a internet e tente novamente.')
          console.log('Erro ao criar solicitação:', error)
        } finally {
          setIsSubmitting(false)
        }
      },
      'Criar Solicitação'
    )
  }

  const handleSaveDraft = () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      showWarning('Rascunho Vazio', 'Preencha pelo menos o título ou descrição para salvar como rascunho.')
      return
    }

    showConfirm(
      'Salvar Rascunho',
      'Deseja salvar esta solicitação como rascunho? Você poderá editá-la e publicar depois.',
      () => {
        setTimeout(() => {
          showSuccess('Rascunho Salvo', 'Sua solicitação foi salva como rascunho.')
        }, 500)
      },
      'Salvar'
    )
  }

  return (
    <>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Nova Solicitação de Suporte</h2>
          <p className="text-gray-600">Descreva seu problema de TI para que possamos conectar você ao profissional adequado.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-bold text-neutral-700">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Computador não liga, Problema na impressora, Configurar rede Wi-Fi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">Mínimo 10 caracteres ({formData.title.length}/10)</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-neutral-700">
              Descrição do Problema *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Quando começou, quais mensagens de erro aparecem, se já tentou algo para resolver..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Quanto mais detalhes você fornecer, melhor será o atendimento.</span>
              <span>Mínimo 20 caracteres ({formData.description.length}/20)</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-700">
              Fotos (opcional)
            </label>
            <p className="text-sm text-gray-500">Envie fotos que possam ajudar a entender o problema. Máximo 5 fotos.</p>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-neutral-400 bg-neutral-50'
                  : 'border-gray-300 hover:border-neutral-400'
              } ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-neutral-600">Arraste e solte suas fotos aqui ou</p>
                  <label className="inline-block mt-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer">
                    Selecionar arquivos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB cada ({formData.photos.length}/5)</p>
              </div>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="100vw"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg border-l-4 border-neutral-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-neutral-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-sm text-neutral-700 font-medium">Seu pedido será aberto</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 ml-7">Profissionais qualificados poderão enviar propostas para seu problema.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-900 transition-colors shadow-lg focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </>
              ) : (
                'Criar Solicitação'
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex-1 bg-white text-neutral-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar como Rascunho
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
