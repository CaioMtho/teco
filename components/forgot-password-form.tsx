'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { resetPassword } from '../forgot-password/actions';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 
                 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 
                 transition-all duration-200 shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center"
    >
      {pending ? (
        'Enviando...'
      ) : (
        <>
          Enviar link de recuperação
          <ChevronRight className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Esqueceu a senha?</h1>
            <p className="text-gray-300 text-sm">
              Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <div className="p-8">
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              )}

              {state?.message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">{state.message}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Verifique sua caixa de entrada e spam.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email cadastrado
                </label>
                <input 
                  type="email"
                  name="email"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 
                           focus:outline-none focus:border-gray-800 transition-colors
                           hover:border-gray-300"
                  placeholder="seu@email.com"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enviaremos um link de recuperação para este email.
                </p>
              </div>

              <SubmitButton />
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-gray-800 hover:text-gray-600 font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}