import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Aluno, Compromisso, DashboardResumo, TipoCompromisso } from '../../models/edupresente.models';
import { DadosService } from '../../services/dados';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterModule, BaseChartDirective], templateUrl: './dashboard.html' })
export class Dashboard implements OnInit {
  private readonly dados = inject(DadosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  resumo: DashboardResumo = { total: 0, leve: 0, moderada: 0, prioritaria: 0, acoesPendentes: 0, casosComMelhora: 0, frequenciaMedia: 0 };
  alunosPrioritarios: Aluno[] = [];
  compromissosSemana: Compromisso[] = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = { labels: ['LEVE', 'MOD', 'PRIO'], datasets: [{ data: [0, 0, 0], backgroundColor: ['#16a34a', '#fbbf24', '#dc2626'], borderRadius: 4, barThickness: 40 }] };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, border: { display: false } } } };
  public lineChartData: ChartConfiguration<'line'>['data'] = { labels: ['MAR', 'ABR', 'MAI', 'JUN'], datasets: [{ data: [0, 0, 0, 0], borderColor: '#071e3d', borderWidth: 3, tension: 0.4, pointBackgroundColor: '#071e3d', pointRadius: 4, fill: false }] };
  public lineChartOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } };

  ngOnInit(): void {
    const alunos = this.dados.listarAlunos();
    const acoes = this.dados.listarAcoes();
    this.atualizarCompromissos(this.dados.listarCompromissos());
    this.dados.compromissosSincronizados$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(compromissos => {
      this.atualizarCompromissos(compromissos);
      this.cdr.markForCheck();
    });
    const resumo = this.dados.calcularResumoDashboard(alunos, acoes);
    this.resumo = resumo;
    this.alunosPrioritarios = alunos.filter(a => a.prioridade === 'Prioritária').sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 3);
    this.barChartData = { ...this.barChartData, datasets: [{ ...this.barChartData.datasets[0], data: [resumo.leve, resumo.moderada, resumo.prioritaria] }] };
    const faltas = [0, 1, 2, 3].map(i => Math.round(alunos.reduce((s, a) => s + (100 - (a.tendenciaFrequencia[i] ?? a.frequencia)), 0) / Math.max(alunos.length, 1)));
    this.lineChartData = { ...this.lineChartData, datasets: [{ ...this.lineChartData.datasets[0], data: faltas }] };
  }

  iniciais(nome?: string): string { return nome ? nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() : '--'; }
  principalMotivo(aluno?: Aluno): string { return aluno?.motivos[0] ?? 'Acompanhamento preventivo'; }
  corCompromisso(tipo: TipoCompromisso): string { return ({ reuniao: 'bg-green-100 text-green-600', visita: 'bg-blue-100 text-blue-600', ligacao: 'bg-yellow-100 text-yellow-600', reforco: 'bg-violet-100 text-violet-600', outro: 'bg-slate-100 text-slate-600' })[tipo]; }
  descricaoData(compromisso: Compromisso): string {
    const hoje = this.iso(new Date());
    const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
    if (compromisso.data === hoje) return `Hoje, ${compromisso.hora}`;
    if (compromisso.data === this.iso(amanha)) return `Amanhã, ${compromisso.hora}`;
    return `${compromisso.data.split('-').reverse().join('/')}, ${compromisso.hora}`;
  }
  private atualizarCompromissos(compromissos: Compromisso[]): void {
    const inicio = this.iso(new Date());
    const fimData = new Date(); fimData.setDate(fimData.getDate() + 7);
    const fim = this.iso(fimData);
    this.compromissosSemana = compromissos.filter(item => !item.concluido && item.data >= inicio && item.data <= fim).sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`)).slice(0, 3);
  }
  private iso(data: Date): string { return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`; }
}
