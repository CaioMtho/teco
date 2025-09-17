import MascoteTeco from "./components/mascote-teco";

export default function Home() {
  return (
    <main className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex-shrink-0 w-80 p-8 flex flex-col justify-center space-y-6 bg-gradient-to-b from-neutral-700 to-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-600/20 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Para Profissionais</h2>
            <p className="text-gray-300 leading-relaxed">
              Cadastre-se e ofereça seus serviços de TI. Conecte-se com clientes que precisam da sua expertise.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Defina seus preços</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Gerencie sua agenda</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Receba avaliações</span>
            </div>
          </div>
          
          <button className="mt-6 bg-white text-neutral-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Sou Profissional
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-white relative">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gray-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-24 w-24 h-24 bg-gray-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 text-center">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <MascoteTeco />
          </div>
          
          <h1 className="text-5xl font-bold mt-8 bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent">
            Conheça o Teco
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 px-8 max-w-md leading-relaxed">
            Conectamos o profissional de suporte de TI com quem precisa dele!
          </p>
          
          <div className="flex justify-center space-x-4 mt-8">
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
              ✓ Confiável
            </div>
            <div className="bg-gray-200 text-neutral-800 px-4 py-2 rounded-full text-sm font-medium">
              ⚡ Rápido
            </div>
            <div className="bg-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium">
              🎯 Especializado
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-80 p-8 flex flex-col justify-center space-y-6 bg-gradient-to-b from-neutral-600 to-neutral-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-500/20 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Para Clientes</h2>
            <p className="text-gray-300 leading-relaxed">
              Precisa de ajuda com TI? Encontre profissionais qualificados para resolver seus problemas.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Busque por especialidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Compare preços</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Agende online</span>
            </div>
          </div>
          
          <button className="mt-6 bg-white text-neutral-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Preciso de Ajuda
          </button>
        </div>
      </div>
    </main>
  );
}