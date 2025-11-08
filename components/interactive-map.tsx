'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { MapPin, MessageCircle, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RequestLocation {
    id: string;
    title: string;
    description: string;
    requester_id: string;
    latitude: number;
    longitude: number;
    created_at: string;
}

interface InteractiveMapProps {
    onStartChat?: (requestId: string) => void;
}

const userIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMzYjgycmY2Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const requestIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMiA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQwQzE2IDQwIDMyIDI0IDMyIDE2QzMyIDcuMTYzNDQgMjQuODM2NiAwIDE2IDBDNy4xNjM0NCAwIDAgNy4xNjM0NCAwIDE2QzAgMjQgMTYgNDAgMTYgNDBaIiBmaWxsPSIjZWY0NDQ0Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
});

function RecenterMap({ center }: { center: LatLng }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
}

export function InteractiveMap({ onStartChat }: InteractiveMapProps) {
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);
    const [requests, setRequests] = useState<RequestLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mapRef = useRef<any>(null);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchNearbyRequests = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch('/api/requests');
            if (!response.ok) throw new Error('Erro ao buscar requisições');

            const data = await response.json();
            
            const nearby = data.filter((request: any) => {
                if (!request.latitude || !request.longitude) return false;
                const distance = calculateDistance(latitude, longitude, request.latitude, request.longitude);
                return distance <= 30;
            });

            setRequests(nearby);
        } catch (err) {
            console.error('Erro ao buscar requisições:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = new LatLng(latitude, longitude);
                    setUserLocation(location);
                    fetchNearbyRequests(latitude, longitude);
                },
                (err) => {
                    setError('Não foi possível obter sua localização');
                    setLoading(false);
                    const defaultLocation = new LatLng(-23.5505, -46.6333);
                    setUserLocation(defaultLocation);
                    fetchNearbyRequests(-23.5505, -46.6333);
                }
            );
        } else {
            setError('Geolocalização não suportada');
            setLoading(false);
        }
    }, []);

    const handleStartChat = (requestId: string) => {
        if (onStartChat) {
            onStartChat(requestId);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (error && !userLocation) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Erro de Localização</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            {userLocation && (
                <MapContainer
                    center={userLocation}
                    zoom={13}
                    className="w-full h-full"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <RecenterMap center={userLocation} />

                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>
                            <div className="text-sm font-medium">Você está aqui</div>
                        </Popup>
                    </Marker>

                    {requests.map((request) => (
                        <Marker
                            key={request.id}
                            position={new LatLng(request.latitude, request.longitude)}
                            icon={requestIcon}
                        >
                            <Popup maxWidth={300}>
                                <div className="space-y-2 p-2">
                                    <div>
                                        <h3 className="font-semibold text-base">{request.title}</h3>
                                        <p className="text-sm text-neutral-600 mt-1 line-clamp-3">
                                            {request.description}
                                        </p>
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {new Date(request.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleStartChat(request.id)}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Iniciar Chat
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}

            <div className="absolute top-4 right-4 z-1000 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-600" />
                    <span className="font-medium">{requests.length}</span>
                    <span className="text-neutral-600">requisições próximas</span>
                </div>
            </div>
        </div>
    );
}
