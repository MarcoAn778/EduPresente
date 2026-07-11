import { ChangeDetectorRef, Component, DestroyRef, ElementRef, HostListener, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DadosService } from '../../services/dados';
import { PreferenciasService } from '../../services/preferencias';
import { AcaoPedagogica, Aluno } from '../../models/edupresente.models';

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  rota: string[];
  cor: string;
  lida: boolean;
}

@Component({ selector: 'app-header', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './header.html' })
export class HeaderComponent implements OnInit {
  private readonly dados = inject(DadosService);
  private readonly preferenciasService = inject(PreferenciasService);
  private readonly router = inject(Router);
  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  notificacoes: Notificacao[] = [];
  painelAberto = false;
  private alunos: Aluno[] = [];
  private acoes: AcaoPedagogica[] = [];
  private lidas = new Set<string>();

  readonly preferencias = this.preferenciasService.preferencias;
  readonly perfil = this.preferenciasService.perfil;

  constructor() {
    effect(() => { this.preferencias(); this.montarNotificacoes(); });
  }

  ngOnInit(): void {
    this.carregarLidas();
    this.alunos = this.dados.listarAlunos();
    this.acoes = this.dados.listarAcoes();
    this.montarNotificacoes();
    this.dados.alunosSincronizados$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(alunos => { this.alunos = alunos; this.montarNotificacoes(); this.cdr.markForCheck(); });
    this.dados.acoesSincronizadas$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(acoes => { this.acoes = acoes; this.montarNotificacoes(); this.cdr.markForCheck(); });
  }

  get naoLidas(): number { return this.notificacoes.filter(item => !item.lida).length; }
  alternarPainel(evento: MouseEvent): void { evento.stopPropagation(); this.painelAberto = !this.painelAberto; }
  async abrirNotificacao(notificacao: Notificacao): Promise<void> { this.marcarComoLida(notificacao); this.painelAberto = false; await this.router.navigate(notificacao.rota); }
  marcarTodasComoLidas(): void { this.notificacoes.forEach(item => this.lidas.add(item.id)); this.salvarLidas(); this.montarNotificacoes(); }

  @HostListener('document:click', ['$event'])
  fecharAoClicarFora(evento: MouseEvent): void { if (this.painelAberto && !this.elemento.nativeElement.contains(evento.target as Node)) this.painelAberto = false; }

  private montarNotificacoes(): void {
    const preferencias = this.preferencias();
    const itens: Omit<Notificacao, 'lida'>[] = [];
    if (preferencias.alertaPrioridade) {
      this.alunos.filter(aluno => aluno.prioridade === 'Prioritária').slice(0, 6).forEach(aluno => itens.push({ id: `prioridade-${aluno.id}`, titulo: `${aluno.nome} precisa de atenção`, descricao: `${aluno.frequencia}% de frequência · média ${aluno.media.toFixed(1)}`, rota: ['/app/perfil', aluno.id], cor: 'bg-red-500' }));
    }
    if (preferencias.acoesPendentes) {
      this.acoes.filter(acao => acao.status === 'Pendente').slice(0, 6).forEach(acao => itens.push({ id: `acao-${acao.id}`, titulo: acao.titulo, descricao: `${this.nomeAluno(acao.alunoId)} · ação pendente`, rota: ['/app/historico', acao.alunoId], cor: 'bg-yellow-500' }));
    }
    if (preferencias.baixaFrequencia) {
      this.alunos.filter(aluno => { const ultimos = aluno.tendenciaFrequencia.slice(-3); return ultimos.length >= 2 && ultimos.every(valor => valor < 75); }).slice(0, 6).forEach(aluno => itens.push({ id: `frequencia-${aluno.id}`, titulo: `Baixa frequência continuada`, descricao: `${aluno.nome} permanece com ${aluno.frequencia}%`, rota: ['/app/perfil', aluno.id], cor: 'bg-orange-500' }));
    }
    this.notificacoes = itens.map(item => ({ ...item, lida: this.lidas.has(item.id) }));
  }
  private nomeAluno(id: string): string { return this.alunos.find(aluno => aluno.id === id)?.nome ?? 'Estudante'; }
  private marcarComoLida(notificacao: Notificacao): void { this.lidas.add(notificacao.id); this.salvarLidas(); this.montarNotificacoes(); }
  private carregarLidas(): void { if (typeof localStorage !== 'undefined') this.lidas = new Set(JSON.parse(localStorage.getItem('edupresente_notificacoes_lidas') ?? '[]')); }
  private salvarLidas(): void { if (typeof localStorage !== 'undefined') localStorage.setItem('edupresente_notificacoes_lidas', JSON.stringify([...this.lidas])); }
}
