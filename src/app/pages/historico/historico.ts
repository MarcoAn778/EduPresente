import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AcaoPedagogica, Aluno } from '../../models/edupresente.models';
import { DadosService } from '../../services/dados';
import { ModalAcaoComponent } from '../../components/modal-acao/modal-acao';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ResumoPeriodo {
  texto: string;
  destaque: string;
  classeDestaque: string;
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective, ModalAcaoComponent],
  templateUrl: './historico.html',
})
export class Historico implements OnInit {
  @ViewChild(ModalAcaoComponent) modalAcao?: ModalAcaoComponent;
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dados = inject(DadosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  aluno?: Aluno;
  acoes: AcaoPedagogica[] = [];
  ordemAscendente = false;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['ABR', 'MAI', 'JUN'],
    datasets: [
      {
        data: [0, 0, 0],
        borderColor: '#071e3d',
        borderWidth: 2,
        tension: 0,
        pointBackgroundColor: '#071e3d',
        pointRadius: 3,
        fill: false,
      },
    ],
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
        ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' },
      },
    },
  };
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/app/alunos']);
      return;
    }
    this.dados.alunosSincronizados$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alunos) => {
        const atualizado = alunos.find((aluno) => aluno.id === id);
        if (atualizado) {
          this.definirAluno(atualizado);
          this.cdr.markForCheck();
        }
      });
    this.dados.acoesSincronizadas$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((acoes) => {
      this.acoes = acoes.filter((acao) => acao.alunoId === id);
      this.ordenar(this.ordemAscendente);
      this.cdr.markForCheck();
    });
    const aluno = this.dados.buscarAluno(id);
    if (!aluno) {
      void this.router.navigate(['/app/alunos']);
      return;
    }
    this.definirAluno(aluno);
    this.carregarAcoes();
  }
  carregarAcoes(): void {
    if (this.aluno) this.acoes = this.dados.listarAcoes(this.aluno.id);
    this.ordenar(false);
  }
  voltar(): void {
    this.location.back();
  }
  abrirNovaAcao(): void {
    this.modalAcao?.abrir();
  }
  alternarOrdem(): void {
    this.ordemAscendente = !this.ordemAscendente;
    this.ordenar(this.ordemAscendente);
  }
  get mediaTrimestral(): number {
    const t = this.aluno?.tendenciaFrequencia.slice(-3) ?? [];
    return t.reduce((s, n) => s + n, 0) / Math.max(t.length, 1);
  }
  get tendencia(): number {
    const t = this.aluno?.tendenciaFrequencia ?? [];
    return t.length > 1 ? t.at(-1)! - t[0] : 0;
  }
  get resumoPeriodo(): ResumoPeriodo {
    const aluno = this.aluno;
    if (!aluno)
      return {
        texto: 'Dados insuficientes para gerar o resumo do período.',
        destaque: 'Aguardando indicadores',
        classeDestaque: 'text-blue-200',
      };

    const historico = aluno.tendenciaFrequencia;
    const frequenciaInicial = historico[0] ?? aluno.frequencia;
    const frequenciaAtual = historico.at(-1) ?? aluno.frequencia;
    const variacao = frequenciaAtual - frequenciaInicial;
    const pendentes = this.acoes.filter((acao) => acao.status === 'Pendente').length;
    const concluidas = this.acoes.filter((acao) => acao.status === 'Concluída').length;

    if (variacao >= 5) {
      const complemento =
        frequenciaAtual < 75
          ? 'Apesar do avanço, a frequência ainda está abaixo de 75% e precisa de acompanhamento contínuo.'
          : aluno.media < 6
            ? 'A presença evoluiu, mas a média permanece abaixo de 6,0; o apoio pedagógico deve continuar.'
            : 'Os indicadores atuais recomendam consolidar as ações que produziram esse avanço.';
      return {
        texto: `O estudante apresenta melhora de ${variacao} pontos percentuais na frequência, passando de ${frequenciaInicial}% para ${frequenciaAtual}%. ${complemento}${concluidas ? ` Há ${concluidas} ação(ões) concluída(s) no período.` : ''}`,
        destaque: 'Evolução positiva observada',
        classeDestaque: 'text-green-200',
      };
    }

    if (variacao <= -5) {
      return {
        texto: `Foi identificada queda de ${Math.abs(variacao)} pontos percentuais na frequência, de ${frequenciaInicial}% para ${frequenciaAtual}%. A equipe deve revisar as causas recentes e priorizar contato com o estudante${pendentes ? `, acompanhando também ${pendentes} ação(ões) pendente(s)` : ''}.`,
        destaque: 'Intervenção pedagógica recomendada',
        classeDestaque: 'text-red-200',
      };
    }

    if (aluno.prioridade === 'Prioritária' || frequenciaAtual < 75 || aluno.media < 6) {
      const fatores = [
        frequenciaAtual < 75 ? `frequência de ${frequenciaAtual}%` : '',
        aluno.media < 6 ? `média ${aluno.media.toFixed(1)}` : '',
      ]
        .filter(Boolean)
        .join(' e ');
      return {
        texto: `Os indicadores permanecem em atenção prioritária${fatores ? `, com ${fatores}` : ''}. Não houve variação expressiva na frequência, portanto é importante manter ações frequentes e registrar os próximos resultados.`,
        destaque: 'Acompanhamento prioritário ativo',
        classeDestaque: 'text-yellow-200',
      };
    }

    if (Math.abs(variacao) <= 2) {
      return {
        texto: `A frequência permaneceu estável no período, atualmente em ${frequenciaAtual}%, e a média está em ${aluno.media.toFixed(1)}. O cenário não indica agravamento, mas deve continuar sendo acompanhado preventivamente.`,
        destaque: 'Cenário estável em observação',
        classeDestaque: 'text-blue-200',
      };
    }

    return {
      texto: `Há uma variação positiva discreta de ${variacao} pontos percentuais na frequência. O avanço ainda deve ser observado nos próximos períodos antes de alterar a prioridade de acompanhamento.`,
      destaque: 'Evolução em observação',
      classeDestaque: 'text-blue-200',
    };
  }
  private ordenar(asc: boolean): void {
    this.acoes = [...this.acoes].sort((a, b) =>
      asc ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data),
    );
  }
  getIconColor(tipo: string): string {
    return tipo === 'contato'
      ? 'bg-red-100 text-red-500 ring-4 ring-white'
      : tipo === 'conversa'
        ? 'bg-green-100 text-green-500 ring-4 ring-white'
        : 'bg-orange-100 text-orange-500 ring-4 ring-white';
  }
  getBadgeStatus(status: string): string {
    return status === 'Pendente'
      ? 'bg-slate-200 text-slate-700'
      : status === 'Concluída'
        ? 'bg-green-200 text-green-800'
        : 'bg-orange-200 text-orange-800';
  }
  private definirAluno(aluno: Aluno): void {
    this.aluno = aluno;
    const tendencia = aluno.tendenciaFrequencia.slice(-3);
    this.lineChartData = {
      ...this.lineChartData,
      datasets: [{ ...this.lineChartData.datasets[0], data: tendencia }],
    };
  }
}