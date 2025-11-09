'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng, LocationEvent, ErrorEvent } from 'leaflet';
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

function LocationMarker({ onLocationFound }: { onLocationFound: (latlng: LatLng) => void }) {
    const map = useMap();
    
    useEffect(() => {
        map.locate({ watch: false, enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });

        function onLocationFoundHandler(e: LocationEvent) {
            onLocationFound(e.latlng);
            map.flyTo(e.latlng, 13);
        }

        function onLocationErrorHandler(_: ErrorEvent) {
            onLocationFound(DEFAULT_LOCATION);
        }

        map.on('locationfound', onLocationFoundHandler);
        map.on('locationerror', onLocationErrorHandler);

        return () => {
            map.off('locationfound', onLocationFoundHandler);
            map.off('locationerror', onLocationErrorHandler);
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

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const fetchNearbyRequests = async (latitude: number, longitude: number) => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch('/api/requests', { signal: controller.signal });
            if (!response.ok) throw new Error(`Erro ${response.status}`);

            const data: RequestLocation[] = await response.json();
            
            const nearby = data.filter((request) => {
                if (request.latitude === null || request.longitude === null) return false;
                const distance = calculateDistance(latitude, longitude, request.latitude, request.longitude);
                return distance <= SEARCH_RADIUS_KM;
            });

            setRequests(nearby);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setError('Não foi possível carregar as requisições próximas');
        } finally {
            setLoading(false);
        }
    };

    const handleLocationFound = (latlng: LatLng) => {
        setUserLocation(latlng);
        setLocationReady(true);
        fetchNearbyRequests(latlng.lat, latlng.lng);
    };

    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    const handleStartChat = (requestId: string) => {
        onStartChat?.(requestId);
    };

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

            <MapContainer center={DEFAULT_LOCATION} zoom={13} className="w-full h-full" style={{ zIndex: 1 }}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker onLocationFound={handleLocationFound} />

                {locationReady && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup><div className="text-sm font-medium">Você está aqui</div></Popup>
                    </Marker>
                )}

                {requests.map((r) => (
                    r.latitude !== null && r.longitude !== null && (
                        <Marker key={r.id} position={new LatLng(r.latitude, r.longitude)} icon={requestIcon}>
                            <Popup maxWidth={300}>
                                <div className="space-y-2 p-2">
                                    <h3 className="font-semibold text-base">{r.title}</h3>
                                    <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{r.description}</p>
                                    <Button size="sm" className="w-full" onClick={() => handleStartChat(r.id)}>
                                        <MessageCircle className="h-4 w-4 mr-2" /> Iniciar Chat
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}
