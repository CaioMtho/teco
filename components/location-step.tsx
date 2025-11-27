'use client';

import { useState } from 'react';
import { Card } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { useGeolocation } from '../hooks/use-geolocation';
import { LocationData } from '../lib/types/triagem.types';

interface LocationStepProps {
  onComplete: (data: LocationData) => void;
  onBack: () => void;
}

export function LocationStep({ onComplete, onBack }: LocationStepProps) {
  const { loading, error, getCurrentLocation } = useGeolocation();
  const [manualMode, setManualMode] = useState(false);
  const [formData, setFormData] = useState<Partial<LocationData>>({
    country: 'Brasil',
  });

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onComplete(location);
    }
  };

  const handleManualSubmit = () => {
    const required: (keyof LocationData)[] = [
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
      'zipCode',
      'country',
    ];

    const isValid = required.every((field) => formData[field]);

    if (!isValid) {
      return;
    }

    onComplete({
      latitude: 0,
      longitude: 0,
      address: `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city} - ${formData.state}`,
      ...formData,
    } as LocationData);
  };

  const handleInputChange = (field: keyof LocationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (manualMode) {
    return (
      <Card className="px-2 py-4 sm:p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Informe seu endereço
            </h2>
            <p className="text-neutral-600 text-sm">
              Precisamos saber onde você está para enviar um técnico
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={formData.street || ''}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Nome da rua"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number || ''}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="complement">Complemento (opcional)</Label>
              <Input
                id="complement"
                value={formData.complement || ''}
                onChange={(e) => handleInputChange('complement', e.target.value)}
                placeholder="Apto, bloco, etc"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood || ''}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode || ''}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="00000-000"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="UF"
                  className="mt-1"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline" className="flex-1">
              Voltar
            </Button>
            <Button
              onClick={() => setManualMode(false)}
              variant="outline"
              className="flex-1"
            >
              Usar localização
            </Button>
            <Button
              onClick={handleManualSubmit}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800"
            >
              Continuar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-2 py-4 sm:p-6 overflow-hidden">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-neutral-700" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Onde você está?
          </h2>
          <p className="text-neutral-600 text-sm">
            Precisamos da sua localização para enviar um técnico até você
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 h-12"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Obtendo localização...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Usar minha localização atual
              </>
            )}
          </Button>

          <Button
            onClick={() => setManualMode(true)}
            variant="outline"
            className="w-full h-12"
          >
            Informar endereço manualmente
          </Button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Voltar
          </Button>
        </div>
      </div>
    </Card>
  );
}