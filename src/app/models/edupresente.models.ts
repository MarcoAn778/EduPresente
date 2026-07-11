export type NivelAtencao = 'Leve' | 'Moderada' | 'Prioritária';
export type StatusAcompanhamento = 'Pendente' | 'Acompanhamento' | 'Concluído';
export type StatusAcao = 'Pendente' | 'Em andamento' | 'Concluída';

export interface Aluno {
  id: string;
  nome: string;
  cpfMascarado: string;
  ano: string;
  turma: string;
  turno: string;
  frequencia: number;
  media: number;
  faltas: number;
  desmotivacao: boolean;
  necessidadeTrabalhar: boolean;
  problemaTransporte: boolean;
  acompanhamentoFamiliar: boolean;
  status: StatusAcompanhamento;
  prioridade: NivelAtencao;
  pontuacao: number;
  motivos: string[];
  tendenciaFrequencia: number[];
  mediasBimestrais: number[];
}

export interface AcaoPedagogica {
  id: string;
  alunoId: string;
  tipo: 'contato' | 'conversa' | 'reforco' | 'encaminhamento';
  titulo: string;
  responsavel: string;
  data: string;
  status: StatusAcao;
  descricao: string;
  tags?: string[];
}

export interface NovaAcao {
  alunoId: string;
  tipo: AcaoPedagogica['tipo'];
  responsavel: string;
  data: string;
  status: StatusAcao;
  descricao: string;
}

export interface DashboardResumo {
  total: number;
  leve: number;
  moderada: number;
  prioritaria: number;
  acoesPendentes: number;
  casosComMelhora: number;
  frequenciaMedia: number;
}

export type TipoCompromisso = 'reuniao' | 'visita' | 'ligacao' | 'reforco' | 'outro';
export type PrioridadeCompromisso = 'Normal' | 'Alta';

export interface Compromisso {
  id: string;
  alunoId?: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: TipoCompromisso;
  prioridade: PrioridadeCompromisso;
  responsavel: string;
  concluido: boolean;
}

export type NovoCompromisso = Omit<Compromisso, 'id' | 'concluido'>;
