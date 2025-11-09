'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng, Map as LeafletMap } from 'leaflet';
import { Card, CardHeader, CardTitle, CardDescription } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { MapPin, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RequestLocation {
    id: string;
    title: string;
    description: string;
    requester_id: string;
    latitude: number | null;
    longitude: number | null;
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

const DEFAULT_LOCATION = new LatLng(-23.5505, -46.6333);
const SEARCH_RADIUS_KM = 30;

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
    const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const mapRef = useRef<LeafletMap | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

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
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/requests', {
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data: RequestLocation[] = await response.json();
            
            // Filtrar apenas requisições com coordenadas válidas e próximas
            const nearby = data.filter((request) => {
                // Validar se as coordenadas existem e são números válidos
                if (
                    request.latitude === null || 
                    request.longitude === null ||
                    typeof request.latitude !== 'number' ||
                    typeof request.longitude !== 'number' ||
                    isNaN(request.latitude) ||
                    isNaN(request.longitude)
                ) {
                    return false;
                }

                const distance = calculateDistance(
                    latitude, 
                    longitude, 
                    request.latitude, 
                    request.longitude
                );
                
                return distance <= SEARCH_RADIUS_KM;
            });

            setRequests(nearby);
            console.log(`Encontradas ${nearby.length} requisições próximas (${data.length} total)`);
        } catch (err) {
            // Ignorar erros de abort (quando o componente é desmontado)
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('Requisição cancelada');
                return;
            }
            
            console.error('Erro ao buscar requisições:', err);
            setError('Não foi possível carregar as requisições próximas');
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = () => {
        setLoading(true);
        setError(null);

        if (!('geolocation' in navigator)) {
            setError('Seu navegador não suporta geolocalização');
            setUserLocation(DEFAULT_LOCATION);
            fetchNearbyRequests(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Localização obtida:', { latitude, longitude });
                const location = new LatLng(latitude, longitude);
                setUserLocation(location);
                setLocationPermission('granted');
                fetchNearbyRequests(latitude, longitude);
            },
            (err) => {
                console.error('Erro de geolocalização:', err);
                
                let errorMessage = 'Não foi possível obter sua localização. ';
                
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage += 'Permissão negada. Por favor, permita o acesso à localização nas configurações do navegador.';
                        setLocationPermission('denied');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage += 'Localização indisponível. Verifique se o GPS está ativado ou se você está em uma área com boa cobertura.';
                        break;
                    case err.TIMEOUT:
                        errorMessage += 'Tempo esgotado. Tente novamente.';
                        break;
                    default:
                        errorMessage += 'Erro desconhecido ao obter localização.';
                }
                
                setError(errorMessage);
                setUserLocation(DEFAULT_LOCATION);
                fetchNearbyRequests(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    useEffect(() => {
        requestLocation();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleStartChat = (requestId: string) => {
        if (onStartChat) {
            onStartChat(requestId);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-500 mx-auto" />
                    <p className="text-sm text-neutral-600">Obtendo sua localização...</p>
                </div>
            </div>
        );
    }

    if (!userLocation) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50 p-4">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Erro de Localização
                        </CardTitle>
                        <CardDescription className="space-y-4">
                            <p>{error || 'Não foi possível obter sua localização'}</p>
                            <Button onClick={requestLocation} className="w-full">
                                Tentar Novamente
                            </Button>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
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
                        <div className="text-sm">
                            <div className="font-medium">Você está aqui</div>
                            {locationPermission === 'denied' && (
                                <div className="text-xs text-amber-600 mt-1">
                                    Usando localização aproximada
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>

                {requests.map((request) => (
                    request.latitude !== null && request.longitude !== null && (
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
                    )
                ))}
            </MapContainer>

            {error && locationPermission === 'denied' && (
                <div className="absolute top-4 left-4 z-[1000] bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-3 max-w-xs">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                            <p className="font-medium mb-1">Localização aproximada</p>
                            <p>Permita o acesso à localização para ver requisições mais próximas.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-600" />
                    <span className="font-medium">{requests.length}</span>
                    <span className="text-neutral-600">requisições próximas</span>
                </div>
            </div>
        </div>
    );
}