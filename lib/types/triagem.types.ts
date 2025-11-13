export interface TriageQuestion {
  id: string;
  text: string;
  options: TriageOption[];
  category: string;
}

export interface TriageOption {
  id: string;
  text: string;
  followUpSolutions?: string[];
  nextQuestionId?: string;
}

export interface TriageAnswer {
  questionId: string;
  answerId: string;
  answerText: string;
  category: string;
}

export interface TriageSolution {
  title: string;
  steps: string[];
  attempted: boolean;
}

export interface TriageData {
  answers: TriageAnswer[];
  solutions: TriageSolution[];
  timestamp: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

export interface RequestFormData {
  title: string;
  description: string;
  photos: string[];
  location: LocationData;
  triageData: TriageData;
}

export const TRIAGE_QUESTIONS: Record<string, TriageQuestion> = {
  initial: {
    id: 'initial',
    text: 'Qual tipo de problema você está enfrentando?',
    category: 'categoria_principal',
    options: [
      {
        id: 'hardware',
        text: 'Problema com equipamento físico (computador, impressora, etc)',
        nextQuestionId: 'hardware_type',
      },
      {
        id: 'software',
        text: 'Problema com programas ou aplicativos',
        nextQuestionId: 'software_type',
      },
      {
        id: 'network',
        text: 'Problema com internet ou rede',
        nextQuestionId: 'network_type',
      },
      {
        id: 'other',
        text: 'Outro tipo de problema',
        nextQuestionId: 'other_description',
      },
    ],
  },
  hardware_type: {
    id: 'hardware_type',
    text: 'Que tipo de equipamento está com problema?',
    category: 'tipo_hardware',
    options: [
      {
        id: 'computer',
        text: 'Computador ou notebook',
        nextQuestionId: 'hardware_symptom',
        followUpSolutions: [
          'Verifique se todos os cabos estão conectados corretamente',
          'Certifique-se de que o equipamento está ligado na tomada',
          'Tente reiniciar o equipamento',
        ],
      },
      {
        id: 'printer',
        text: 'Impressora',
        nextQuestionId: 'hardware_symptom',
        followUpSolutions: [
          'Verifique se há papel suficiente na bandeja',
          'Confirme se o cabo USB está conectado',
          'Verifique se há tinta ou toner',
        ],
      },
      {
        id: 'peripheral',
        text: 'Periférico (mouse, teclado, monitor)',
        nextQuestionId: 'hardware_symptom',
        followUpSolutions: [
          'Verifique se o dispositivo está conectado corretamente',
          'Tente conectar em outra porta USB',
          'Teste com outro dispositivo similar se possível',
        ],
      },
    ],
  },
  hardware_symptom: {
    id: 'hardware_symptom',
    text: 'O que está acontecendo com o equipamento?',
    category: 'sintoma_hardware',
    options: [
      {
        id: 'not_turning_on',
        text: 'Não liga ou não funciona',
      },
      {
        id: 'strange_noise',
        text: 'Faz barulhos estranhos',
      },
      {
        id: 'slow',
        text: 'Está muito lento',
      },
      {
        id: 'error_message',
        text: 'Mostra mensagens de erro',
      },
    ],
  },
  software_type: {
    id: 'software_type',
    text: 'Qual programa está com problema?',
    category: 'tipo_software',
    options: [
      {
        id: 'windows',
        text: 'Sistema operacional (Windows, etc)',
        nextQuestionId: 'software_symptom',
        followUpSolutions: [
          'Tente reiniciar o computador',
          'Verifique se há atualizações pendentes',
          'Execute o Windows Update',
        ],
      },
      {
        id: 'office',
        text: 'Programas de escritório (Word, Excel, etc)',
        nextQuestionId: 'software_symptom',
        followUpSolutions: [
          'Feche e abra o programa novamente',
          'Verifique se o arquivo não está corrompido',
          'Tente abrir um novo arquivo para testar',
        ],
      },
      {
        id: 'browser',
        text: 'Navegador de internet',
        nextQuestionId: 'software_symptom',
        followUpSolutions: [
          'Limpe o cache e cookies do navegador',
          'Tente usar outro navegador',
          'Desative extensões temporariamente',
        ],
      },
      {
        id: 'specific',
        text: 'Programa específico da empresa',
        nextQuestionId: 'software_symptom',
      },
    ],
  },
  software_symptom: {
    id: 'software_symptom',
    text: 'O que está acontecendo com o programa?',
    category: 'sintoma_software',
    options: [
      {
        id: 'not_opening',
        text: 'Não abre ou não inicia',
      },
      {
        id: 'freezing',
        text: 'Trava ou congela',
      },
      {
        id: 'error',
        text: 'Mostra erro ao usar',
      },
      {
        id: 'data_loss',
        text: 'Perdi dados ou arquivos',
      },
    ],
  },
  network_type: {
    id: 'network_type',
    text: 'Qual o problema com a conexão?',
    category: 'tipo_rede',
    options: [
      {
        id: 'no_connection',
        text: 'Não consigo conectar à internet',
        followUpSolutions: [
          'Verifique se o cabo de rede está conectado',
          'Reinicie o roteador (desligue por 30 segundos)',
          'Verifique se o Wi-Fi está ligado no dispositivo',
          'Tente se conectar a outra rede para testar',
        ],
      },
      {
        id: 'slow',
        text: 'Internet está muito lenta',
        followUpSolutions: [
          'Teste a velocidade em sites como fast.com',
          'Verifique quantos dispositivos estão conectados',
          'Aproxime-se do roteador se estiver usando Wi-Fi',
        ],
      },
      {
        id: 'intermittent',
        text: 'Conexão cai constantemente',
        followUpSolutions: [
          'Verifique se o problema ocorre com cabo e Wi-Fi',
          'Reinicie o roteador',
          'Verifique se não há interferências próximas ao roteador',
        ],
      },
    ],
  },
  other_description: {
    id: 'other_description',
    text: 'Descreva brevemente o tipo de problema',
    category: 'outro',
    options: [
      {
        id: 'custom',
        text: 'Problema personalizado (descreva nos detalhes)',
      },
    ],
  },
};

export function formatTriageForDescription(triageData: TriageData): string {
  const lines = ['[TRIAGEM_AUTOMATICA]'];
  
  lines.push(`Timestamp: ${new Date(triageData.timestamp).toLocaleString('pt-BR')}`);
  lines.push('');
  
  lines.push('Respostas:');
  triageData.answers.forEach((answer) => {
    lines.push(`- ${answer.category}: ${answer.answerText}`);
  });
  
  if (triageData.solutions.length > 0) {
    lines.push('');
    lines.push('Soluções sugeridas:');
    triageData.solutions.forEach((solution, index) => {
      lines.push(`${index + 1}. ${solution.title}`);
      solution.steps.forEach((step) => {
        lines.push(`   - ${step}`);
      });
      lines.push(`   Tentou aplicar: ${solution.attempted ? 'Sim' : 'Não'}`);
    });
  }
  
  lines.push('[/TRIAGEM_AUTOMATICA]');
  lines.push('');
  
  return lines.join('\n');
}

export function extractUserDescription(fullDescription: string): string {
  const regex = /\[TRIAGEM_AUTOMATICA\][\s\S]*?\[\/TRIAGEM_AUTOMATICA\]\n*/;
  return fullDescription.replace(regex, '').trim();
}