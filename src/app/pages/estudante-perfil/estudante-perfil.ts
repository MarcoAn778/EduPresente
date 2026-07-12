import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DadosService } from '../../services/dados';
import { AcaoPedagogica, Aluno } from '../../models/edupresente.models';
import { ModalAcaoComponent } from '../../components/modal-acao/modal-acao';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ selector: 'app-estudante-perfil', standalone: true, imports: [CommonModule, RouterModule, BaseChartDirective, ModalAcaoComponent], templateUrl: './estudante-perfil.html' })
export class EstudantePerfil implements OnInit {
  @ViewChild(ModalAcaoComponent) modalAcao?: ModalAcaoComponent;
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dados = inject(DadosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  aluno?: Aluno;
  acoesRecentes: AcaoPedagogica[] = [];
  readonly bimestres = [0, 1, 2, 3];
  public barChartData: ChartConfiguration<'bar'>['data'] = { labels: ['MAR', 'ABR', 'MAI', 'JUN'], datasets: [{ data: [0, 0, 0, 0], backgroundColor: ['#071e3d', '#071e3d', '#fbbf24', '#dc2626'], borderRadius: 4, barThickness: 40 }] };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { y: { display: false, min: 0, max: 100 }, x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' } } } };
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { void this.router.navigate(['/app/alunos']); return; }
    this.dados.alunosSincronizados$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(alunos => {
      const atualizado = alunos.find(aluno => aluno.id === id);
      if (atualizado) { this.definirAluno(atualizado); this.cdr.markForCheck(); }
    });
    this.dados.acoesSincronizadas$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(acoes => {
      this.acoesRecentes = acoes.filter(acao => acao.alunoId === id).slice(0, 5);
      this.cdr.markForCheck();
    });
    const aluno = this.dados.buscarAluno(id);
    if (!aluno) { void this.router.navigate(['/app/alunos']); return; }
    this.definirAluno(aluno);
    this.carregarAcoes();
  }
  voltar(): void { this.location.back(); }
  abrirNovaAcao(): void { this.modalAcao?.abrir(); }
  carregarAcoes(): void { if (this.aluno) this.acoesRecentes = this.dados.listarAcoes(this.aluno.id).slice(0, 5); }
  mediaBimestre(indice: number): number | undefined { return this.aluno?.mediasBimestrais[indice]; }
  get variacaoMedia(): number | null {
    const medias = this.aluno?.mediasBimestrais.filter(Number.isFinite) ?? [];
    if (medias.length < 2) return null;
    const variacao = Number((medias.at(-1)! - medias.at(-2)!).toFixed(1));
    return Object.is(variacao, -0) ? 0 : variacao;
  }
  get classeVariacaoMedia(): string {
    if (this.variacaoMedia === null || this.variacaoMedia === 0) return 'text-slate-500';
    return this.variacaoMedia > 0 ? 'text-green-600' : 'text-red-600';
  }
  getBadgeStatusAcao(status: string): string { return status === 'Pendente' ? 'bg-red-100 text-red-700' : status === 'Concluída' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-[#071e3d]'; }
  badgeAtencao(): string { return this.aluno?.prioridade === 'Prioritária' ? 'bg-red-100 text-red-700' : this.aluno?.prioridade === 'Moderada' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'; }
  private definirAluno(aluno: Aluno): void {
    this.aluno = aluno;
    this.barChartData = { ...this.barChartData, datasets: [{ ...this.barChartData.datasets[0], data: aluno.tendenciaFrequencia }] };
  }
}
