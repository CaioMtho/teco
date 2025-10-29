'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '../login/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full p-3 py-2 mt-2 text-white font-medium transition-colors 
                 bg-gray-800 border-2 border-gray-800 rounded-md hover:bg-gray-700 
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Criando...' : 'Criar Conta'}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <div className="bg-white border-2 border-gray-200 w-96 p-6">
      <h1 className="text-center text-4xl p-2 mb-4">Cadastro</h1>
      
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {state?.message && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="text-sm">{state.message}</p>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email:
          </label>
          <input 
            type="email"
            name="email"
            required
            className="w-full bg-gray-100 border-2 border-gray-200 rounded px-3 py-2 
                       focus:outline-none focus:border-gray-400 transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Senha:
          </label>
          <input 
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full bg-gray-100 border-2 border-gray-200 rounded px-3 py-2 
                       focus:outline-none focus:border-gray-400 transition-colors"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}