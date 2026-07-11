import { Compromisso } from '../models/edupresente.models';

function dataComOffset(dias: number): string {
  const data = new Date();
  data.setHours(12, 0, 0, 0);
  data.setDate(data.getDate() + dias);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export const COMPROMISSOS_SIMULADOS: Compromisso[] = [
  { id: '30000000-0000-4000-8000-000000000001', alunoId: '10000000-0000-4000-8000-000000000001', titulo: 'Contato com responsável', descricao: 'Alinhar estratégias para melhorar a frequência.', data: dataComOffset(0), hora: '09:00', tipo: 'ligacao', prioridade: 'Alta', responsavel: 'Mariana Silva', concluido: false },
  { id: '30000000-0000-4000-8000-000000000002', titulo: 'Reunião pedagógica - 1º A', descricao: 'Revisar estudantes que precisam de acompanhamento.', data: dataComOffset(1), hora: '09:30', tipo: 'reuniao', prioridade: 'Normal', responsavel: 'Coordenação Pedagógica', concluido: false },
  { id: '30000000-0000-4000-8000-000000000003', alunoId: '10000000-0000-4000-8000-000000000003', titulo: 'Reforço escolar', descricao: 'Acompanhamento específico em Matemática.', data: dataComOffset(2), hora: '14:00', tipo: 'reforco', prioridade: 'Normal', responsavel: 'Prof. Roberto', concluido: false },
  { id: '30000000-0000-4000-8000-000000000004', alunoId: '10000000-0000-4000-8000-000000000002', titulo: 'Visita de acompanhamento', descricao: 'Visita combinada com a família.', data: dataComOffset(4), hora: '10:30', tipo: 'visita', prioridade: 'Alta', responsavel: 'Ana Beatriz', concluido: false },
  { id: '30000000-0000-4000-8000-000000000005', titulo: 'Relatório mensal', descricao: 'Consolidar os indicadores da Busca Ativa.', data: dataComOffset(6), hora: '16:00', tipo: 'outro', prioridade: 'Normal', responsavel: 'Núcleo Pedagógico', concluido: false },
  { id: '30000000-0000-4000-8000-000000000006', alunoId: '10000000-0000-4000-8000-000000000014', titulo: 'Ligação para responsável', descricao: 'Alinhar medidas para recuperar frequência e apoiar o transporte.', data: dataComOffset(1), hora: '08:30', tipo: 'ligacao', prioridade: 'Alta', responsavel: 'Mariana Silva', concluido: false },
  { id: '30000000-0000-4000-8000-000000000007', alunoId: '10000000-0000-4000-8000-000000000016', titulo: 'Reunião de acompanhamento prioritário', descricao: 'Construir plano conjunto de permanência escolar.', data: dataComOffset(2), hora: '10:00', tipo: 'reuniao', prioridade: 'Alta', responsavel: 'Núcleo Pedagógico', concluido: false },
  { id: '30000000-0000-4000-8000-000000000008', alunoId: '10000000-0000-4000-8000-000000000015', titulo: 'Monitoria de Matemática', descricao: 'Revisão dos conteúdos do bimestre.', data: dataComOffset(2), hora: '14:30', tipo: 'reforco', prioridade: 'Normal', responsavel: 'Prof. Roberto', concluido: false },
  { id: '30000000-0000-4000-8000-000000000009', alunoId: '10000000-0000-4000-8000-000000000020', titulo: 'Visita de busca ativa', descricao: 'Verificar condições de deslocamento e rotina familiar.', data: dataComOffset(3), hora: '09:00', tipo: 'visita', prioridade: 'Alta', responsavel: 'Assistência Escolar', concluido: false },
  { id: '30000000-0000-4000-8000-000000000010', alunoId: '10000000-0000-4000-8000-000000000018', titulo: 'Escuta pedagógica', descricao: 'Reavaliar as metas semanais de participação.', data: dataComOffset(4), hora: '11:00', tipo: 'outro', prioridade: 'Normal', responsavel: 'Orientação Escolar', concluido: false },
  { id: '30000000-0000-4000-8000-000000000011', alunoId: '10000000-0000-4000-8000-000000000022', titulo: 'Reunião com a família', descricao: 'Tratar da queda de frequência observada.', data: dataComOffset(5), hora: '15:30', tipo: 'reuniao', prioridade: 'Alta', responsavel: 'Mariana Silva', concluido: false },
  { id: '30000000-0000-4000-8000-000000000012', alunoId: '10000000-0000-4000-8000-000000000025', titulo: 'Reforço de Ciências', descricao: 'Atividade dirigida do plano de recuperação.', data: dataComOffset(6), hora: '13:30', tipo: 'reforco', prioridade: 'Normal', responsavel: 'Prof. Helena', concluido: false },
  { id: '30000000-0000-4000-8000-000000000013', alunoId: '10000000-0000-4000-8000-000000000027', titulo: 'Contato de acompanhamento', descricao: 'Verificar adaptação à nova rotina de estudos.', data: dataComOffset(7), hora: '18:30', tipo: 'ligacao', prioridade: 'Normal', responsavel: 'Orientação Escolar', concluido: false },
  { id: '30000000-0000-4000-8000-000000000014', alunoId: '10000000-0000-4000-8000-000000000013', titulo: 'Devolutiva à família', descricao: 'Compartilhar evolução acadêmica e próximos objetivos.', data: dataComOffset(8), hora: '09:30', tipo: 'reuniao', prioridade: 'Normal', responsavel: 'Prof. Camila', concluido: false },
  { id: '30000000-0000-4000-8000-000000000015', alunoId: '10000000-0000-4000-8000-000000000017', titulo: 'Acompanhamento preventivo', descricao: 'Conferir continuidade do bom desempenho.', data: dataComOffset(10), hora: '10:30', tipo: 'outro', prioridade: 'Normal', responsavel: 'Coordenação Pedagógica', concluido: false }
];
