'use client';

import { InteractiveMap } from '@/../components/interactive-map';
import { useRouter } from 'next/navigation';

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