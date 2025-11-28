'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import { Icon, LatLng, divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card, CardHeader, CardTitle, CardDescription } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '../app/components/ui/dialog';
import { MapPin, MessageCircle, Loader2, AlertCircle, User } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RequestLocation {
    id: string;
    title: string;
    description: string;
    requester_id: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    address?: {
        latitude: number | null;
        longitude: number | null;
    } | null;
}

interface InteractiveMapProps {
    onStartChat?: (requestId: string) => void;
}

interface LocationFoundEvent {
    latlng: LatLng;
    accuracy: number;
}

interface LocationErrorEvent {
    code: number;
    message: string;
}

const DEFAULT_LOCATION = new LatLng(-23.5505, -46.6333);
const SEARCH_RADIUS_KM = 30;

const createUserIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            border: '4px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <User size={16} color="white" strokeWidth={3} />
        </div>
    );
    
    return divIcon({
        html: iconHtml,
        className: 'custom-user-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const createRequestIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div style={{
            width: '32px',
            height: '40px',
            position: 'relative'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#ef4444',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                transform: 'rotate(-45deg)',
                position: 'absolute',
                top: '0',
                left: '0'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'white'
                }} />
            </div>
        </div>
    );
    
    return divIcon({
        html: iconHtml,
        className: 'custom-request-icon',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    });
};

function LocationMarker({ onLocationFound }: { onLocationFound: (latlng: LatLng) => void }) {
    const map = useMap();
    const hasLocatedRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
        if (hasLocatedRef.current) return;

        const tryNavigatorGeolocation = async () => {
            if (!('geolocation' in navigator)) {
                hasLocatedRef.current = true;
                console.warn('Geolocalização não suportada pelo navegador, usando localização padrão');
                onLocationFound(DEFAULT_LOCATION);
                map.setView(DEFAULT_LOCATION, 13);
                return;
            }

            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 300000,
                    });
                });

                if (hasLocatedRef.current) return;
                hasLocatedRef.current = true;
                const latlng = new LatLng(position.coords.latitude, position.coords.longitude);
                onLocationFound(latlng);
                map.setView(latlng, 13);
            } catch (err) {
                // If browser's geolocation uses a network provider internally (e.g. Chromium calling Google's API)
                // we avoid retrying against external services and fall back to the default location.
                if (hasLocatedRef.current) return;
                hasLocatedRef.current = true;
                console.warn('Geolocalização falhou (provável provedor de rede com quota), usando localização padrão');
                onLocationFound(DEFAULT_LOCATION);
                map.setView(DEFAULT_LOCATION, 13);
            }
        };

        // Try navigator geolocation once; avoid map.locate to prevent repeated network geolocation calls
        tryNavigatorGeolocation();

        return () => {
            // nothing to cleanup for navigator.getCurrentPosition
        };
    }, [map, onLocationFound]);

    return null;
}

export function InteractiveMap({ onStartChat }: InteractiveMapProps) {
    const [userLocation, setUserLocation] = useState<LatLng>(DEFAULT_LOCATION);
    const [requests, setRequests] = useState<RequestLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationReady, setLocationReady] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const userIconRef = useRef(createUserIcon());
    const requestIconRef = useRef(createRequestIcon());

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

                const json = await response.json();
                const data: any[] = Array.isArray(json) ? json : (Array.isArray((json as any).data) ? (json as any).data : [])

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

            const json = await response.json();
            const data: any[] = Array.isArray(json) ? json : (Array.isArray((json as any).data) ? (json as any).data : []);

            // Normalize coords (mantém a lógica original)
            const all = data.map(req => {
                if (req.latitude == null && req.address?.latitude != null) {
                    req.latitude = req.address.latitude;
                }
                if (req.longitude == null && req.address?.longitude != null) {
                    req.longitude = req.address.longitude;
                }
                return req;
            });

            setRequests(all);

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            console.error('Erro ao buscar requisições:', err);
            setError('Não foi possível carregar as requisições próximas');
        } finally {
            setLoading(false);
        }
    };

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            
            console.error('Erro ao buscar requisições:', err);
            setError('Não foi possível carregar as requisições próximas');
        } finally {
            setLoading(false);
        }
    };

    const handleLocationFound = useCallback((latlng: LatLng) => {
        setUserLocation(latlng);
        setLocationReady(true);
        fetchNearbyRequests(latlng.lat, latlng.lng);
    }, []);

    useEffect(() => {
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

    const [selectedRequest, setSelectedRequest] = useState<RequestLocation | null>(null);
    const [openDetails, setOpenDetails] = useState(false);

    const openRequestDetails = (req: RequestLocation) => {
        setSelectedRequest(req);
        setOpenDetails(true);
    }

    const closeRequestDetails = () => {
        setSelectedRequest(null);
        setOpenDetails(false);
    }

    return (
        <div className="w-full h-full relative">
            {loading && (
                <div className="absolute inset-0 z-[2000] bg-white/80 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-500 mx-auto" />
                        <p className="text-sm text-neutral-600">Obtendo sua localização...</p>
                    </div>
                </div>
            )}

            <MapContainer
                center={DEFAULT_LOCATION}
                zoom={13}
                className="w-full h-full"
                style={{ zIndex: 1 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                <LocationMarker onLocationFound={handleLocationFound} />

                {locationReady && (
                    <Marker position={userLocation} icon={userIconRef.current}>
                        <Popup>
                            <div className="text-sm font-medium">Você está aqui</div>
                        </Popup>
                    </Marker>
                )}

                {requests.map((request) => (
                    request.latitude !== null && request.longitude !== null && (
                        <Marker
                            key={request.id}
                            position={new LatLng(request.latitude, request.longitude)}
                            icon={requestIconRef.current}
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
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleStartChat(request.id)}
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Iniciar Chat
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openRequestDetails(request)}
                                        >
                                            Ver detalhes
                                        </Button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

                {/* Request details dialog (use shared Dialog for consistent UI) */}
                <Dialog open={openDetails} onOpenChange={(v) => { if (!v) closeRequestDetails(); setOpenDetails(v); }}>
                    <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
                        {selectedRequest ? (
                            <div className="p-4">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl font-semibold break-words">{selectedRequest.title}</h3>
                                        <p className="text-sm text-neutral-600 mt-2 break-words">{selectedRequest.description}</p>
                                        <div className="text-xs text-neutral-500 mt-3">Solicitado em: {new Date(selectedRequest.created_at).toLocaleString('pt-BR')}</div>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                                        <DialogClose asChild>
                                            <Button variant="ghost" className="w-full sm:w-auto">Fechar</Button>
                                        </DialogClose>
                                        <Button onClick={() => { handleStartChat(selectedRequest.id); closeRequestDetails(); }} className="w-full sm:w-auto">Iniciar Chat</Button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>

            {error && (
                <div className="absolute top-4 left-4 z-[1000] bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-3 max-w-xs">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                            <p className="font-medium mb-1">Aviso</p>
                            <p>{error}</p>
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