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
  { id: '30000000-0000-4000-8000-000000000005', titulo: 'Relatório mensal', descricao: 'Consolidar os indicadores da Busca Ativa.', data: dataComOffset(6), hora: '16:00', tipo: 'outro', prioridade: 'Normal', responsavel: 'Núcleo Pedagógico', concluido: false }
];
