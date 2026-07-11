import { AcaoPedagogica, Aluno } from '../models/edupresente.models';

type AlunoBase = Omit<Aluno, 'pontuacao' | 'prioridade' | 'motivos' | 'mediasBimestrais'>;

export function calcularPrioridade(aluno: AlunoBase): Pick<Aluno, 'pontuacao' | 'prioridade' | 'motivos'> {
  let pontuacao = 0;
  const motivos: string[] = [];

  if (aluno.frequencia < 75) { pontuacao += 35; motivos.push('Frequência abaixo de 75%'); }
  if (aluno.faltas > 8) { pontuacao += 20; motivos.push('Mais de 8 faltas no mês'); }
  if (aluno.media < 6) { pontuacao += 20; motivos.push('Média abaixo de 6,0'); }
  if (aluno.desmotivacao) { pontuacao += 15; motivos.push('Desmotivação ou baixa participação'); }
  if (aluno.necessidadeTrabalhar) { pontuacao += 15; motivos.push('Necessidade de trabalhar'); }
  if (aluno.problemaTransporte) { pontuacao += 10; motivos.push('Problemas de transporte'); }
  if (!aluno.acompanhamentoFamiliar) { pontuacao += 10; motivos.push('Sem acompanhamento familiar registrado'); }

  const prioridade = pontuacao >= 61 ? 'Prioritária' : pontuacao >= 31 ? 'Moderada' : 'Leve';
  return { pontuacao, prioridade, motivos: motivos.length ? motivos : ['Acompanhamento preventivo de rotina'] };
}

const bases: AlunoBase[] = [
  { id: '10000000-0000-4000-8000-000000000001', nome: 'Lucas Andrade', cpfMascarado: '452.***.***-01', ano: '2º Ano', turma: 'B', turno: 'Matutino', frequencia: 68, media: 5.4, faltas: 10, desmotivacao: true, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Pendente', tendenciaFrequencia: [86, 82, 75, 68] },
  { id: '10000000-0000-4000-8000-000000000002', nome: 'Mariana Souza', cpfMascarado: '128.***.***-54', ano: '1º Ano', turma: 'A', turno: 'Matutino', frequencia: 62, media: 4.8, faltas: 12, desmotivacao: false, necessidadeTrabalhar: true, problemaTransporte: true, acompanhamentoFamiliar: false, status: 'Acompanhamento', tendenciaFrequencia: [78, 74, 69, 62] },
  { id: '10000000-0000-4000-8000-000000000003', nome: 'Roberto Martins', cpfMascarado: '832.***.***-12', ano: '3º Ano', turma: 'C', turno: 'Noturno', frequencia: 75, media: 2.8, faltas: 9, desmotivacao: true, necessidadeTrabalhar: true, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Acompanhamento', tendenciaFrequencia: [88, 84, 78, 75] },
  { id: '10000000-0000-4000-8000-000000000004', nome: 'Ana Beatriz Silva', cpfMascarado: '622.***.***-99', ano: '3º Ano', turma: 'A', turno: 'Matutino', frequencia: 81, media: 7.2, faltas: 7, desmotivacao: true, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Acompanhamento', tendenciaFrequencia: [88, 85, 83, 81] },
  { id: '10000000-0000-4000-8000-000000000005', nome: 'Rafael Lima Santos', cpfMascarado: '341.***.***-28', ano: '3º Ano', turma: 'B', turno: 'Matutino', frequencia: 92, media: 8.5, faltas: 1, desmotivacao: false, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Concluído', tendenciaFrequencia: [87, 89, 90, 92] },
  { id: '10000000-0000-4000-8000-000000000006', nome: 'Mariana Mendes', cpfMascarado: '940.***.***-06', ano: '2º Ano', turma: 'A', turno: 'Vespertino', frequencia: 78, media: 6.1, faltas: 4, desmotivacao: true, necessidadeTrabalhar: false, problemaTransporte: true, acompanhamentoFamiliar: true, status: 'Acompanhamento', tendenciaFrequencia: [84, 82, 80, 78] },
  { id: '10000000-0000-4000-8000-000000000007', nome: 'João Pedro Costa', cpfMascarado: '713.***.***-45', ano: '1º Ano', turma: 'C', turno: 'Vespertino', frequencia: 88, media: 9.0, faltas: 2, desmotivacao: false, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Concluído', tendenciaFrequencia: [84, 85, 87, 88] },
  { id: '10000000-0000-4000-8000-000000000008', nome: 'Camila Oliveira', cpfMascarado: '205.***.***-73', ano: '2º Ano', turma: 'B', turno: 'Vespertino', frequencia: 73, media: 6.7, faltas: 9, desmotivacao: false, necessidadeTrabalhar: false, problemaTransporte: true, acompanhamentoFamiliar: true, status: 'Pendente', tendenciaFrequencia: [82, 80, 76, 73] },
  { id: '10000000-0000-4000-8000-000000000009', nome: 'Gabriel Ferreira', cpfMascarado: '604.***.***-19', ano: '1º Ano', turma: 'B', turno: 'Matutino', frequencia: 84, media: 5.8, faltas: 5, desmotivacao: true, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Acompanhamento', tendenciaFrequencia: [86, 85, 83, 84] },
  { id: '10000000-0000-4000-8000-000000000010', nome: 'Isabela Rocha', cpfMascarado: '458.***.***-91', ano: '3º Ano', turma: 'C', turno: 'Noturno', frequencia: 70, media: 6.2, faltas: 11, desmotivacao: false, necessidadeTrabalhar: true, problemaTransporte: true, acompanhamentoFamiliar: false, status: 'Pendente', tendenciaFrequencia: [81, 77, 74, 70] },
  { id: '10000000-0000-4000-8000-000000000011', nome: 'Thiago Nascimento', cpfMascarado: '117.***.***-30', ano: '2º Ano', turma: 'C', turno: 'Noturno', frequencia: 86, media: 7.6, faltas: 3, desmotivacao: false, necessidadeTrabalhar: true, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Acompanhamento', tendenciaFrequencia: [82, 83, 85, 86] },
  { id: '10000000-0000-4000-8000-000000000012', nome: 'Sofia Almeida', cpfMascarado: '389.***.***-67', ano: '1º Ano', turma: 'A', turno: 'Vespertino', frequencia: 95, media: 8.9, faltas: 0, desmotivacao: false, necessidadeTrabalhar: false, problemaTransporte: false, acompanhamentoFamiliar: true, status: 'Concluído', tendenciaFrequencia: [91, 92, 94, 95] }
];

export const ALUNOS_SIMULADOS: Aluno[] = bases.map(aluno => ({
  ...aluno,
  ...calcularPrioridade(aluno),
  mediasBimestrais: [Math.min(10, Number((aluno.media + 0.6).toFixed(1))), aluno.media]
}));

export const ACOES_SIMULADAS: AcaoPedagogica[] = [
  { id: '20000000-0000-4000-8000-000000000001', alunoId: bases[0].id, tipo: 'contato', titulo: 'Contato com responsável', responsavel: 'Mariana Silva (Coord.)', data: '2026-06-14', status: 'Pendente', descricao: 'Agendada reunião presencial para conversar sobre as faltas recorrentes e as dificuldades de transporte.' },
  { id: '20000000-0000-4000-8000-000000000002', alunoId: bases[0].id, tipo: 'conversa', titulo: 'Conversa individual', responsavel: 'Prof. Roberto', data: '2026-06-10', status: 'Concluída', descricao: 'O estudante relatou desmotivação por dificuldades em Matemática e se mostrou receptivo ao apoio extra.' },
  { id: '20000000-0000-4000-8000-000000000003', alunoId: bases[0].id, tipo: 'reforco', titulo: 'Início do reforço escolar', responsavel: 'Núcleo Pedagógico', data: '2026-06-05', status: 'Em andamento', descricao: 'Início das sessões de reforço em Matemática.', tags: ['Frequência: 100%', 'Engajamento: Alto'] },
  { id: '20000000-0000-4000-8000-000000000004', alunoId: bases[1].id, tipo: 'encaminhamento', titulo: 'Apoio para transporte', responsavel: 'Assistência Escolar', data: '2026-06-16', status: 'Em andamento', descricao: 'Encaminhamento para avaliação de acesso ao transporte escolar.' },
  { id: '20000000-0000-4000-8000-000000000005', alunoId: bases[2].id, tipo: 'conversa', titulo: 'Plano de recuperação', responsavel: 'Prof. Helena', data: '2026-06-18', status: 'Pendente', descricao: 'Preparar plano de recuperação para o próximo ciclo.' }
];
