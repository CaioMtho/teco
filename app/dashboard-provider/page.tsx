'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const InteractiveMap = dynamic(
    () => import('@/../components/interactive-map').then(mod => ({ default: mod.InteractiveMap })),
    { 
        ssr: false,
        loading: () => (
            <div className="h-screen w-full flex items-center justify-center bg-neutral-50">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        )
    }
);

export default function DashboardProvider() {
    const router = useRouter();

    const handleStartChat = (requestId: string) => {
        console.log('Iniciar chat com requisição:', requestId);
    };

    return (
        <div className="h-screen w-full">
            <InteractiveMap onStartChat={handleStartChat} />
        </div>
    );
}