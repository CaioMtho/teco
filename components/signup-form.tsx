'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '../signup/actions';
import Link from 'next/link';
import { Mail, Lock, User, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

function SubmitButton({ passwordsMatch }: { passwordsMatch: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending || !passwordsMatch}
      className="w-full bg-linear-to-r from-gray-700 to-gray-800 text-white px-6 py-3 
                 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 
                 transition-all duration-200 shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center"
    >
      {pending ? (
        'Criando conta...'
      ) : (
        <>
          Criar Conta
          <ChevronRight className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signup, null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
    } else if (confirmPassword && newPassword === confirmPassword) {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password && password !== newConfirmPassword) {
      setPasswordError('As senhas não coincidem');
    } else if (password && password === newConfirmPassword) {
      setPasswordError('');
    }
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-gray-700 to-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-300 text-sm">Junte-se à comunidade Teco</p>
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

              {state?.message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    <p className="text-sm text-green-700">{state.message}</p>
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
                  minLength={6}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 
                           focus:outline-none focus:border-gray-800 transition-colors
                           hover:border-gray-300"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirme a senha
                </label>
                <input 
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full bg-gray-50 border-2 rounded-lg px-4 py-3 
                           focus:outline-none transition-colors hover:border-gray-300
                           ${passwordError ? 'border-red-400 focus:border-red-500' : 
                             passwordsMatch ? 'border-green-400 focus:border-green-500' : 
                             'border-gray-200 focus:border-gray-800'}`}
                  placeholder="••••••••"
                />
                {passwordError && confirmPassword && (
                  <div className="flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1 shrink-0" />
                    <p className="text-xs text-red-600">{passwordError}</p>
                  </div>
                )}
                {passwordsMatch && (
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1 shrink-0" />
                    <p className="text-xs text-green-600">As senhas coincidem</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Ao criar uma conta, você concorda com nossos:</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/terms" className="text-gray-800 hover:text-gray-600 font-medium">
                    Termos de Serviço
                  </Link>
                  <span>e</span>
                  <Link href="/privacy" className="text-gray-800 hover:text-gray-600 font-medium">
                    Política de Privacidade
                  </Link>
                </div>
              </div>

              <SubmitButton passwordsMatch={passwordsMatch} />
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
                Já tem uma conta?{' '}
                <Link 
                  href="/login"
                  className="text-gray-800 hover:text-gray-600 font-semibold"
                >
                  Entre aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}