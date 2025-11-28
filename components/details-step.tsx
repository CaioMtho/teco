'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { TriageData } from '@/../lib/types/triagem.types';

interface DetailsStepProps {
  triageData: TriageData;
  onComplete: (data: { title: string; description: string; photos: string[] }) => void;
  onBack: () => void;
}

export function DetailsStep({ triageData, onComplete, onBack }: DetailsStepProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const suggestedTitle = triageData.answers[triageData.answers.length - 1]?.answerText || '';

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newPhotos.push(base64);
    }

    setPhotos([...photos, ...newPhotos].slice(0, 5));
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    } else if (description.trim().length < 20) {
      newErrors.description = 'A descrição deve ter pelo menos 20 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onComplete({ title: title.trim(), description: description.trim(), photos });
  };

  const useSuggestedTitle = () => {
    setTitle(suggestedTitle);
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  return (
    <Card className="px-2 py-4 sm:p-6 overflow-hidden">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Conte-nos mais sobre o problema
          </h2>
          <p className="text-neutral-600 text-sm">
            Quanto mais detalhes você fornecer, melhor poderemos ajudá-lo
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título da solicitação</Label>
            <div className="space-y-2 mt-1">
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Ex: Computador não liga"
                maxLength={100}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
              {suggestedTitle && title !== suggestedTitle && (
                <Button
                  type="button"
                  onClick={useSuggestedTitle}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Usar: &ldquo;{suggestedTitle}&rdquo;
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição detalhada</Label>
            <p className="text-xs text-neutral-500 mt-1 mb-2">
              Descreva o problema em detalhes: quando começou, o que você estava fazendo, 
              mensagens de erro, etc.
            </p>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Descreva o problema..."
              rows={6}
              maxLength={2000}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              {description.length}/2000 caracteres
            </p>
          </div>

          <div>
            <Label>Fotos (opcional)</Label>
            <p className="text-xs text-neutral-500 mt-1 mb-2">
              Adicione até 5 fotos que ajudem a entender o problema (máx. 5MB cada)
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors">
                  <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
                  <span className="text-xs text-neutral-600">Adicionar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800"
          >
            Revisar solicitação
          </Button>
        </div>
      </div>
    </Card>
  );
}