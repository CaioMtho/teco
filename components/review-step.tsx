'use client';

import { useState } from 'react';
import { Card } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Loader2, CheckCircle2, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { TriageData, LocationData, formatTriageForDescription } from '../lib/types/triagem.types';

interface ReviewStepProps {
  triageData: TriageData;
  locationData: LocationData;
  title: string;
  description: string;
  photos: string[];
  onBack: () => void;
  onSuccess: () => void;
}

export function ReviewStep({
  triageData,
  locationData,
  title,
  description,
  photos,
  onBack,
  onSuccess,
}: ReviewStepProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const addressResponse = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          street: locationData.street,
          number: locationData.number,
          complement: locationData.complement || null,
          neighborhood: locationData.neighborhood,
          city: locationData.city,
          state: locationData.state,
          zip_code: locationData.zipCode,
          country: locationData.country,
          latitude: locationData.latitude || null,
          longitude: locationData.longitude || null,
        }),
        credentials: 'include',
      });

      if (!addressResponse.ok) {
        const errorData = await addressResponse.json();
        throw new Error(errorData.message || 'Erro ao salvar endereço');
      }

      const triagePrefix = formatTriageForDescription(triageData);
      const fullDescription = triagePrefix + description;

      const requestResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: fullDescription,
          photos: photos.length > 0 ? photos : null,
        }),
        credentials: 'include',
      });

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        throw new Error(errorData.message || 'Erro ao criar solicitação');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar solicitação'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Solicitação criada com sucesso!
          </h2>
          <p className="text-neutral-600">
            Em breve um técnico entrará em contato com você
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Revise sua solicitação
          </h2>
          <p className="text-neutral-600 text-sm">
            Confira se todas as informações estão corretas antes de enviar
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-neutral-900 pl-4">
            <h3 className="font-semibold text-neutral-900 text-lg">{title}</h3>
          </div>

          <Card className="p-4 bg-neutral-50 border-neutral-200">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900 mb-1">Descrição</h4>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-neutral-50 border-neutral-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900 mb-1">Localização</h4>
                <p className="text-sm text-neutral-700">
                  {locationData.street}, {locationData.number}
                  {locationData.complement && ` - ${locationData.complement}`}
                </p>
                <p className="text-sm text-neutral-700">
                  {locationData.neighborhood} - {locationData.city}/{locationData.state}
                </p>
                <p className="text-sm text-neutral-700">CEP: {locationData.zipCode}</p>
              </div>
            </div>
          </Card>

          {photos.length > 0 && (
            <Card className="p-4 bg-neutral-50 border-neutral-200">
              <div className="flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 mb-3">
                    Fotos ({photos.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full aspect-square object-cover rounded border border-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">Triagem realizada</h4>
                <p className="text-sm text-blue-800">
                  {triageData.answers.length} {triageData.answers.length === 1 ? 'resposta' : 'respostas'} registrada
                  {triageData.answers.length !== 1 ? 's' : ''}
                  {triageData.solutions.length > 0 && (
                    <>, {triageData.solutions.filter(s => s.attempted).length} soluç
                    {triageData.solutions.filter(s => s.attempted).length === 1 ? 'ão tentada' : 'ões tentadas'}</>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
            disabled={submitting}
          >
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Criar solicitação'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}