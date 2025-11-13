import { useState, useCallback } from 'react';
import { LocationData } from '../lib/types/triagem.types';

interface GeolocationError {
  message: string;
  code?: number;
}

interface UseGeolocationReturn {
  loading: boolean;
  error: GeolocationError | null;
  getCurrentLocation: () => Promise<LocationData | null>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<Omit<LocationData, 'latitude' | 'longitude'>> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Falha ao obter endereço');
    }

    const data = await response.json();
    const addr = data.address || {};

    return {
      address: data.display_name || '',
      city: addr.city || addr.town || addr.village || '',
      state: addr.state || '',
      country: addr.country || 'Brasil',
      zipCode: addr.postcode || '',
      neighborhood: addr.suburb || addr.neighbourhood || '',
      street: addr.road || '',
      number: addr.house_number || 's/n',
      complement: undefined,
    };
  };

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const err = { message: 'Geolocalização não suportada pelo navegador' };
      setError(err);
      setLoading(false);
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const addressData = await reverseGeocode(latitude, longitude);

      const locationData: LocationData = {
        latitude,
        longitude,
        ...addressData,
      };

      setLoading(false);
      return locationData;
    } catch (err) {
      let errorMessage = 'Erro ao obter localização';

      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter localização';
            break;
        }
      }

      const error = { message: errorMessage };
      setError(error);
      setLoading(false);
      return null;
    }
  }, []);

  return { loading, error, getCurrentLocation };
}