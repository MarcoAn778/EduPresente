import { ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Aluno, Compromisso, NovoCompromisso, TipoCompromisso } from '../../models/edupresente.models';
import { DadosService } from '../../services/dados';

interface DiaCalendario {
  iso: string;
  numero: number;
  mesAtual: boolean;
  hoje: boolean;
  compromissos: Compromisso[];
}

@Component({ selector: 'app-agenda', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './agenda.html' })
export class Agenda implements OnInit {
  @ViewChild('modalCompromisso') modalCompromisso!: ElementRef<HTMLDialogElement>;
  private readonly dados = inject(DadosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  compromissos: Compromisso[] = [];
  alunos: Aluno[] = [];
  mesExibido = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  dataSelecionada = this.formatarIso(new Date());
  filtroTipo: TipoCompromisso | '' = '';
  filtroPrioridade: 'Normal' | 'Alta' | '' = '';
  salvando = false;
  erro = '';
  readonly diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  readonly tipos: { valor: TipoCompromisso; label: string }[] = [
    { valor: 'reuniao', label: 'Reunião' }, { valor: 'visita', label: 'Visita' },
    { valor: 'ligacao', label: 'Ligação' }, { valor: 'reforco', label: 'Reforço' },
    { valor: 'outro', label: 'Outro' }
  ];
  formulario: NovoCompromisso = this.novoFormulario();

  ngOnInit(): void {
    this.alunos = this.dados.listarAlunos();
    this.compromissos = this.dados.listarCompromissos();
    this.dados.compromissosSincronizados$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(compromissos => {
      this.compromissos = compromissos;
      this.cdr.markForCheck();
    });
  }

  get tituloMes(): string {
    const texto = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(this.mesExibido);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  get compromissosFiltrados(): Compromisso[] {
    return this.compromissos.filter(item =>
      (!this.filtroTipo || item.tipo === this.filtroTipo) &&
      (!this.filtroPrioridade || item.prioridade === this.filtroPrioridade)
    );
  }

  get diasCalendario(): DiaCalendario[] {
    const inicio = new Date(this.mesExibido.getFullYear(), this.mesExibido.getMonth(), 1);
    inicio.setDate(inicio.getDate() - inicio.getDay());
    return Array.from({ length: 42 }, (_, indice) => {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + indice);
      const iso = this.formatarIso(data);
      return {
        iso, numero: data.getDate(), mesAtual: data.getMonth() === this.mesExibido.getMonth(),
        hoje: iso === this.formatarIso(new Date()),
        compromissos: this.compromissosFiltrados.filter(item => item.data === iso)
      };
    });
  }

  get compromissosDoDia(): Compromisso[] {
    return this.compromissosFiltrados.filter(item => item.data === this.dataSelecionada).sort((a, b) => a.hora.localeCompare(b.hora));
  }

  mesAnterior(): void { this.mesExibido = new Date(this.mesExibido.getFullYear(), this.mesExibido.getMonth() - 1, 1); }
  proximoMes(): void { this.mesExibido = new Date(this.mesExibido.getFullYear(), this.mesExibido.getMonth() + 1, 1); }
  irParaHoje(): void { const hoje = new Date(); this.mesExibido = new Date(hoje.getFullYear(), hoje.getMonth(), 1); this.dataSelecionada = this.formatarIso(hoje); }
  selecionarDia(dia: DiaCalendario): void {
    this.dataSelecionada = dia.iso;
    if (!dia.mesAtual) { const data = this.dataLocal(dia.iso); this.mesExibido = new Date(data.getFullYear(), data.getMonth(), 1); }
  }

  abrirModal(data = this.dataSelecionada): void {
    this.formulario = { ...this.novoFormulario(), data };
    this.erro = '';
    this.modalCompromisso.nativeElement.showModal();
  }
  fecharModal(): void { this.modalCompromisso.nativeElement.close(); }
  async salvar(): Promise<void> {
    if (!this.formulario.titulo.trim() || !this.formulario.responsavel.trim() || !this.formulario.data || !this.formulario.hora) {
      this.erro = 'Preencha título, responsável, data e horário.';
      return;
    }
    this.salvando = true;
    await this.dados.registrarCompromisso(this.formulario);
    this.compromissos = this.dados.listarCompromissos();
    this.dataSelecionada = this.formulario.data;
    this.salvando = false;
    this.fecharModal();
  }
  remover(compromisso: Compromisso): void {
    if (window.confirm(`Remover o compromisso "${compromisso.titulo}"?`)) {
      this.dados.removerCompromisso(compromisso.id);
      this.compromissos = this.dados.listarCompromissos();
    }
  }

  nomeAluno(id?: string): string { return id ? this.alunos.find(aluno => aluno.id === id)?.nome ?? '' : ''; }
  labelTipo(tipo: TipoCompromisso): string { return this.tipos.find(item => item.valor === tipo)?.label ?? 'Outro'; }
  corTipo(tipo: TipoCompromisso): string {
    return ({ reuniao: 'bg-green-500', visita: 'bg-blue-500', ligacao: 'bg-yellow-500', reforco: 'bg-violet-500', outro: 'bg-slate-500' })[tipo];
  }
  bordaTipo(tipo: TipoCompromisso): string {
    return ({ reuniao: 'border-l-green-500', visita: 'border-l-blue-500', ligacao: 'border-l-yellow-500', reforco: 'border-l-violet-500', outro: 'border-l-slate-500' })[tipo];
  }
  formatarDataSelecionada(): string {
    const texto = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(this.dataLocal(this.dataSelecionada));
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  private novoFormulario(): NovoCompromisso {
    return { alunoId: undefined, titulo: '', descricao: '', data: this.dataSelecionada, hora: '09:00', tipo: 'reuniao', prioridade: 'Normal', responsavel: '' };
  }
  private formatarIso(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  }
  private dataLocal(iso: string): Date { const [ano, mes, dia] = iso.split('-').map(Number); return new Date(ano, mes - 1, dia, 12); }
}
