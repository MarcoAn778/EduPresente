import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Aluno {
  iniciais: string;
  nome: string;
  cpf: string;
  ano: string;
  turno: string;
  frequencia: number;
  media: number;
  faltas: number;
  atencao: 'Leve' | 'Moderada' | 'Prioritária';
  status: 'Pendente' | 'Acompanhamento' | 'Concluído';
  corInitials: string;
}

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alunos.html'
})
export class Alunos {
  
  listaAlunos: Aluno[] = [
    { iniciais: 'AB', nome: 'Ana Beatriz Silva', cpf: '452.***.***-01', ano: '3º Ano', turno: 'Matutino', frequencia: 65, media: 7.2, faltas: 8, atencao: 'Prioritária', status: 'Pendente', corInitials: 'bg-blue-100 text-[#071e3d]' },
    { iniciais: 'RL', nome: 'Rafael Lima Santos', cpf: '128.***.***-54', ano: '3º Ano', turno: 'Matutino', frequencia: 92, media: 8.5, faltas: 1, atencao: 'Leve', status: 'Acompanhamento', corInitials: 'bg-green-100 text-green-700' },
    { iniciais: 'MM', nome: 'Mariana Mendes', cpf: '832.***.***-12', ano: '2º Ano', turno: 'Vespertino', frequencia: 78, media: 6.1, faltas: 4, atencao: 'Moderada', status: 'Acompanhamento', corInitials: 'bg-blue-100 text-[#071e3d]' },
    { iniciais: 'JP', nome: 'João Pedro Costa', cpf: '622.***.***-99', ano: '1º Ano', turno: 'Matutino', frequencia: 88, media: 9.0, faltas: 2, atencao: 'Leve', status: 'Concluído', corInitials: 'bg-slate-200 text-slate-700' }
  ];

  getBadgeAtencao(atencao: string): string {
    switch (atencao) {
      case 'Prioritária': return 'bg-red-100 text-red-700';
      case 'Moderada': return 'bg-yellow-100 text-yellow-700';
      case 'Leve': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getDotStatus(status: string): string {
    switch (status) {
      case 'Pendente': return 'bg-yellow-400';
      case 'Acompanhamento': return 'bg-green-600';
      case 'Concluído': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  }

  getCorFrequencia(frequencia: number): string {
    if (frequencia < 70) return 'text-red-600';
    if (frequencia < 80) return 'text-yellow-600';
    return 'text-[#071e3d]';
  }

  getBgFrequencia(frequencia: number): string {
    if (frequencia < 70) return 'bg-red-600';
    if (frequencia < 80) return 'bg-yellow-500';
    return 'bg-green-600';
  }
}