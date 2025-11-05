'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updatePassword } from '../app/reset-password/actions';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

function SubmitButton({ passwordsMatch }: { passwordsMatch: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending || !passwordsMatch}
      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 
                 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 
                 transition-all duration-200 shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center"
    >
      {pending ? (
        'Atualizando...'
      ) : (
        <>
          Redefinir senha
          <ChevronRight className="w-5 h-5 ml-2" />
        </>
      )}
    </button>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(updatePassword, null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

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

  const passwordsMatch = password === confirmPassword && password.length >= 6;

  // Redirecionar após sucesso
  if (state?.message) {
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Nova senha</h1>
            <p className="text-gray-300 text-sm">
              Digite sua nova senha abaixo
            </p>
          </div>

          {/* Form */}
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
                        Redirecionando para o login...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Nova senha
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
                  Confirme a nova senha
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
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                    <p className="text-xs text-red-600">{passwordError}</p>
                  </div>
                )}
                {passwordsMatch && (
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                    <p className="text-xs text-green-600">As senhas coincidem</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    <strong>Dica de segurança:</strong> Use uma senha forte com letras maiúsculas, 
                    minúsculas, números e símbolos.
                  </p>
                </div>
              </div>

              <SubmitButton passwordsMatch={passwordsMatch} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}