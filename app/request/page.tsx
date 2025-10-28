import RequestForm from '../components/request-form'

export default function Page(){
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className='text-5xl font-bold text-neutral-800 mb-4'>
                        Solicitar Suporte
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Conecte-se com profissionais de TI qualificados. 
                        Descreva seu problema e receba propostas personalizadas.
                    </p>
                </div>
                
                <RequestForm />
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Profissionais Verificados</h3>
                        <p className="text-gray-600 text-sm">Todos os técnicos passam por processo de verificação e avaliação contínua.</p>
                    </div>
                    
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Atendimento Personalizado</h3>
                        <p className="text-gray-600 text-sm">Você escolhe quem vai te atender com seus próprios critérios.</p>
                    </div>
                    
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Garantia de Serviço</h3>
                        <p className="text-gray-600 text-sm">Seu dinheiro só é liberado depois de confirmar o atendimento.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}