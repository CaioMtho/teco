'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '../login/actions';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, ChevronRight } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-linear-to-r from-gray-700 to-gray-800 text-white px-6 py-3 
                 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 
                 transition-all duration-200 shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center"
    >
      {pending ? (
        'Entrando...'
      ) : (
        <>
          Entrar
          <ChevronRight className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, null);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-gray-700 to-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-300 text-sm">Entre para acessar sua conta</p>
          </div>

          <div className="p-8">
            <form action={formAction} className="space-y-5">
              {state?.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
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
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Senha
                </label>
                <input 
                  type="password"
                  name="password"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 
                           focus:outline-none focus:border-gray-800 transition-colors
                           hover:border-gray-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-gray-800 hover:text-gray-600 font-medium">
                  Esqueceu a senha?
                </a>
              </div>

              <SubmitButton />
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Ainda não tem uma conta?{' '}
                <Link 
                  href="/signup"
                  className="text-gray-800 hover:text-gray-600 font-semibold"
                >
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}