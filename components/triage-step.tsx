'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '../app/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import {
  TriageData,
  TriageAnswer,
  TriageSolution,
  TRIAGE_QUESTIONS,
} from '../lib/types/triagem.types';

interface TriageStepProps {
  onComplete: (data: TriageData) => void;
}

export function TriageStep({ onComplete }: TriageStepProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState('initial');
  const [answers, setAnswers] = useState<TriageAnswer[]>([]);
  const [solutions, setSolutions] = useState<TriageSolution[]>([]);
  const [showingSolutions, setShowingSolutions] = useState(false);
  const [selectedSolutions, setSelectedSolutions] = useState<Set<number>>(new Set());

  const currentQuestion = TRIAGE_QUESTIONS[currentQuestionId];

  const handleAnswer = (optionId: string) => {
    const option = currentQuestion.options.find((opt) => opt.id === optionId);
    if (!option) return;

    const newAnswer: TriageAnswer = {
      questionId: currentQuestion.id,
      answerId: option.id,
      answerText: option.text,
      category: currentQuestion.category,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (option.followUpSolutions && option.followUpSolutions.length > 0) {
      const newSolution: TriageSolution = {
        title: `Soluções para: ${option.text}`,
        steps: option.followUpSolutions,
        attempted: false,
      };
      setSolutions([...solutions, newSolution]);
      setShowingSolutions(true);
    } else if (option.nextQuestionId) {
      setCurrentQuestionId(option.nextQuestionId);
    } else {
      finalizeTriage(updatedAnswers, solutions);
    }
  };

  const handleSolutionAttempted = (index: number, attempted: boolean) => {
    const updated = new Set(selectedSolutions);
    if (attempted) {
      updated.add(index);
    } else {
      updated.delete(index);
    }
    setSelectedSolutions(updated);
  };

  const handleContinueAfterSolutions = () => {
    const updatedSolutions = solutions.map((sol, idx) => ({
      ...sol,
      attempted: selectedSolutions.has(idx),
    }));

    setSolutions(updatedSolutions);
    setShowingSolutions(false);

    const lastAnswer = answers[answers.length - 1];
    const lastQuestion = TRIAGE_QUESTIONS[lastAnswer.questionId];
    const lastOption = lastQuestion.options.find((opt) => opt.id === lastAnswer.answerId);

    if (lastOption?.nextQuestionId) {
      setCurrentQuestionId(lastOption.nextQuestionId);
    } else {
      finalizeTriage(answers, updatedSolutions);
    }
  };

  const finalizeTriage = (finalAnswers: TriageAnswer[], finalSolutions: TriageSolution[]) => {
    const triageData: TriageData = {
      answers: finalAnswers,
      solutions: finalSolutions,
      timestamp: new Date().toISOString(),
    };
    onComplete(triageData);
  };

  if (showingSolutions) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Tente estas soluções primeiro
              </h2>
              <p className="text-neutral-600 mt-1">
                Antes de prosseguir, que tal tentar resolver o problema com estas sugestões?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-4 bg-neutral-50 border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-3">{solution.title}</h3>
                <ul className="space-y-2 mb-4">
                  {solution.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-neutral-700">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-neutral-400" />
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`solution-${index}`}
                    checked={selectedSolutions.has(index)}
                    onCheckedChange={(checked) =>
                      handleSolutionAttempted(index, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`solution-${index}`}
                    className="text-sm text-neutral-700 cursor-pointer"
                  >
                    Tentei esta solução
                  </Label>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleContinueAfterSolutions}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800"
            >
              Continuar com a solicitação
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Etapa {answers.length + 1} da triagem</span>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">{currentQuestion.text}</h2>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              variant="outline"
              className="h-auto p-4 justify-start text-left hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
            >
              <span className="text-neutral-900">{option.text}</span>
            </Button>
          ))}
        </div>

        {answers.length > 0 && (
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Suas respostas:</h3>
            <div className="space-y-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-600">{answer.answerText}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}