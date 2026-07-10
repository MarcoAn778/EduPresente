import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

interface AcaoHistorico {
  tipo: 'contato' | 'conversa' | 'reforco';
  titulo: string;
  responsavel: string;
  data: string;
  status: 'Pendente' | 'Concluída' | 'Em andamento';
  descricao: string;
  isQuote?: boolean;
  tags?: string[];
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './historico.html'
})
export class Historico {
  private location = inject(Location);

  voltar(): void {
    this.location.back();
  }

  acoes: AcaoHistorico[] = [
    {
      tipo: 'contato',
      titulo: 'Contato com responsável',
      responsavel: 'Mariana Silva (Coord.)',
      data: '14 Jun 2026',
      status: 'Pendente',
      descricao: '"Agendada reunião presencial para discutir as faltas recorrentes. A mãe demonstrou abertura, mas mencionou dificuldades de transporte."',
      isQuote: true
    },
    {
      tipo: 'conversa',
      titulo: 'Conversa individual',
      responsavel: 'Prof. Roberto',
      data: '10 Jun 2026',
      status: 'Concluída',
      descricao: 'O estudante relatou desmotivação devido à dificuldade em Matemática. Conversamos sobre como pequenas vitórias podem ajudar a retomar o interesse. Lucas se mostrou receptivo ao apoio extra.'
    },
    {
      tipo: 'reforco',
      titulo: 'Início do Reforço escolar',
      responsavel: 'Núcleo Pedagógico',
      data: '05 Jun 2026',
      status: 'Em andamento',
      descricao: 'Lucas iniciou as sessões de reforço em Matemática. O objetivo é reforçar conceitos básicos de álgebra para que ele se sinta mais seguro nas aulas regulares.',
      tags: ['Frequência: 100%', 'Engajamento: Alto']
    }
  ];

  getIconColor(tipo: string): string {
    switch (tipo) {
      case 'contato': return 'bg-red-100 text-red-500 ring-4 ring-white';
      case 'conversa': return 'bg-green-100 text-green-500 ring-4 ring-white';
      case 'reforco': return 'bg-orange-100 text-orange-500 ring-4 ring-white';
      default: return 'bg-slate-100 text-slate-500 ring-4 ring-white';
    }
  }

  getBorderColor(tipo: string): string {
    switch (tipo) {
      case 'contato': return 'border-red-500';
      case 'conversa': return 'border-green-500';
      case 'reforco': return 'border-orange-500';
      default: return 'border-slate-300';
    }
  }

  getBadgeStatus(status: string): string {
    switch (status) {
      case 'Pendente': return 'bg-slate-200 text-slate-700';
      case 'Concluída': return 'bg-green-200 text-green-800';
      case 'Em andamento': return 'bg-orange-200 text-orange-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
  getClassesAcao(acao: AcaoHistorico): string[] {
  if (!acao.isQuote) return [];
  return ['border-l-4', 'pl-4', 'bg-slate-50', 'py-2', 'rounded-r', this.getBorderColor(acao.tipo)];
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['ABR', 'MAI', 'JUN'],
    datasets: [{
      data: [65, 75, 88],
      borderColor: '#071e3d',
      borderWidth: 2,
      tension: 0,
      pointBackgroundColor: '#071e3d',
      pointRadius: 3,
      fill: false
    }]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      y: { display: false },
      x: { 
        grid: { display: false }, 
        border: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' }
      }
    }
  };
}