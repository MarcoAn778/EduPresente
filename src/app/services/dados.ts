import { Injectable, inject } from '@angular/core';
import { ACOES_SIMULADAS, ALUNOS_SIMULADOS } from '../data/dados-simulados';
import { AcaoPedagogica, Aluno, DashboardResumo, NovaAcao } from '../models/edupresente.models';
import { SupabaseService } from './supabase';
import { Subject } from 'rxjs';
import { COMPROMISSOS_SIMULADOS } from '../data/agenda-simulada';
import { Compromisso, NovoCompromisso } from '../models/edupresente.models';

@Injectable({ providedIn: 'root' })
export class DadosService {
  private readonly supabase = inject(SupabaseService);
  private readonly chaveAlunos = 'edupresente_alunos';
  private readonly chaveAcoes = 'edupresente_acoes';
  private readonly chaveCompromissos = 'edupresente_compromissos';
  private cacheAlunos?: Aluno[];
  private cacheAcoes?: AcaoPedagogica[];
  private cacheCompromissos?: Compromisso[];
  private sincronizacaoAlunosIniciada = false;
  private sincronizacaoAcoesIniciada = false;
  private sincronizacaoCompromissosIniciada = false;
  private readonly alunosSincronizados = new Subject<Aluno[]>();
  private readonly acoesSincronizadas = new Subject<AcaoPedagogica[]>();
  private readonly compromissosSincronizados = new Subject<Compromisso[]>();
  readonly alunosSincronizados$ = this.alunosSincronizados.asObservable();
  readonly acoesSincronizadas$ = this.acoesSincronizadas.asObservable();
  readonly compromissosSincronizados$ = this.compromissosSincronizados.asObservable();

  listarAlunos(): Aluno[] {
    this.cacheAlunos ??= this.mesclarPadrao(this.lerLocal(this.chaveAlunos, ALUNOS_SIMULADOS), ALUNOS_SIMULADOS);
    if (!this.cacheAlunos.length) {
      this.cacheAlunos = structuredClone(ALUNOS_SIMULADOS);
      this.salvarLocal(this.chaveAlunos, this.cacheAlunos);
    }
    this.sincronizarAlunosEmSegundoPlano();
    return this.cacheAlunos;
  }

  buscarAluno(id: string): Aluno | undefined {
    return this.listarAlunos().find(aluno => aluno.id === id);
  }

  listarAcoes(alunoId?: string): AcaoPedagogica[] {
    this.cacheAcoes ??= this.mesclarPadrao(this.lerLocal(this.chaveAcoes, ACOES_SIMULADAS), ACOES_SIMULADAS);
    if (!this.cacheAcoes.length) {
      this.cacheAcoes = structuredClone(ACOES_SIMULADAS);
      this.salvarLocal(this.chaveAcoes, this.cacheAcoes);
    }
    this.sincronizarAcoesEmSegundoPlano();
    const acoes = alunoId ? this.cacheAcoes.filter(acao => acao.alunoId === alunoId) : this.cacheAcoes;
    return acoes;
  }

  async registrarAcao(nova: NovaAcao): Promise<AcaoPedagogica> {
    const tituloPorTipo: Record<NovaAcao['tipo'], string> = {
      contato: 'Contato com responsável', conversa: 'Conversa individual',
      reforco: 'Reforço escolar', encaminhamento: 'Encaminhamento pedagógico'
    };
    const acao: AcaoPedagogica = { ...nova, id: crypto.randomUUID(), titulo: tituloPorTipo[nova.tipo] };
    this.cacheAcoes ??= this.lerLocal(this.chaveAcoes, ACOES_SIMULADAS);
    this.cacheAcoes = [acao, ...this.cacheAcoes.filter(item => item.id !== acao.id)];
    this.salvarLocal(this.chaveAcoes, this.cacheAcoes);
    this.acoesSincronizadas.next(this.cacheAcoes);

    const client = this.supabase.client;
    if (client) {
      void client.from('pedagogical_actions').insert({
        id: acao.id, student_id: acao.alunoId, action_type: acao.tipo, title: acao.titulo,
        responsible: acao.responsavel, action_date: acao.data, status: acao.status,
        description: acao.descricao
      }).then(({ error }) => {
        if (error) console.warn('A ação ficou salva localmente, mas ainda não foi sincronizada com o Supabase.', error.message);
      });
    }
    return acao;
  }

  listarCompromissos(): Compromisso[] {
    this.cacheCompromissos ??= this.mesclarPadrao(this.lerLocal(this.chaveCompromissos, COMPROMISSOS_SIMULADOS), COMPROMISSOS_SIMULADOS);
    if (!this.cacheCompromissos.length) {
      this.cacheCompromissos = structuredClone(COMPROMISSOS_SIMULADOS);
      this.salvarLocal(this.chaveCompromissos, this.cacheCompromissos);
    }
    this.sincronizarCompromissosEmSegundoPlano();
    return this.cacheCompromissos;
  }

  async registrarCompromisso(novo: NovoCompromisso): Promise<Compromisso> {
    const compromisso: Compromisso = { ...novo, id: crypto.randomUUID(), concluido: false };
    this.cacheCompromissos = [compromisso, ...this.listarCompromissos().filter(item => item.id !== compromisso.id)];
    this.salvarLocal(this.chaveCompromissos, this.cacheCompromissos);
    this.compromissosSincronizados.next(this.cacheCompromissos);
    const client = this.supabase.client;
    if (client) {
      void client.from('appointments').insert({
        id: compromisso.id, student_id: compromisso.alunoId || null, title: compromisso.titulo,
        description: compromisso.descricao, event_date: compromisso.data, event_time: compromisso.hora,
        appointment_type: compromisso.tipo, priority: compromisso.prioridade,
        responsible: compromisso.responsavel, completed: compromisso.concluido
      }).then(({ error }) => {
        if (error) console.warn('O compromisso ficou salvo localmente, mas ainda não foi sincronizado.', error.message);
      });
    }
    return compromisso;
  }

  removerCompromisso(id: string): void {
    this.cacheCompromissos = this.listarCompromissos().filter(item => item.id !== id);
    this.salvarLocal(this.chaveCompromissos, this.cacheCompromissos);
    this.compromissosSincronizados.next(this.cacheCompromissos);
    const client = this.supabase.client;
    if (client) void client.from('appointments').delete().eq('id', id);
  }

  calcularResumoDashboard(alunos: Aluno[], acoes: AcaoPedagogica[]): DashboardResumo {
    return {
      total: alunos.length,
      leve: alunos.filter(a => a.prioridade === 'Leve').length,
      moderada: alunos.filter(a => a.prioridade === 'Moderada').length,
      prioritaria: alunos.filter(a => a.prioridade === 'Prioritária').length,
      acoesPendentes: acoes.filter(a => a.status === 'Pendente').length,
      casosComMelhora: alunos.filter(a => a.tendenciaFrequencia.at(-1)! > a.tendenciaFrequencia[0]).length,
      frequenciaMedia: alunos.reduce((soma, a) => soma + a.frequencia, 0) / Math.max(alunos.length, 1)
    };
  }

  restaurarDadosSimulados(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.chaveAlunos);
    localStorage.removeItem(this.chaveAcoes);
    localStorage.removeItem(this.chaveCompromissos);
    this.cacheAlunos = undefined;
    this.cacheAcoes = undefined;
    this.cacheCompromissos = undefined;
  }

  private lerLocal<T>(chave: string, padrao: T[]): T[] {
    if (typeof localStorage === 'undefined') return structuredClone(padrao);
    const valor = localStorage.getItem(chave);
    if (valor) {
      try { return JSON.parse(valor) as T[]; }
      catch { localStorage.removeItem(chave); }
    }
    const copia = structuredClone(padrao);
    this.salvarLocal(chave, copia);
    return copia;
  }

  private salvarLocal<T>(chave: string, valor: T): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(chave, JSON.stringify(valor));
  }

  private mesclarPadrao<T extends { id: string }>(atuais: T[], padrao: T[]): T[] {
    const idsAtuais = new Set(atuais.map(item => item.id));
    const novos = padrao.filter(item => !idsAtuais.has(item.id));
    return novos.length ? [...atuais, ...structuredClone(novos)] : atuais;
  }

  private sincronizarAlunosEmSegundoPlano(): void {
    const client = this.supabase.client;
    if (!client || this.sincronizacaoAlunosIniciada) return;
    this.sincronizacaoAlunosIniciada = true;
    void client.from('students').select('*').order('name').then(({ data, error }) => {
      if (!error && data?.length) {
        this.cacheAlunos = data.map(this.mapearAluno);
        this.salvarLocal(this.chaveAlunos, this.cacheAlunos);
        this.alunosSincronizados.next(this.cacheAlunos);
      }
    });
  }

  private sincronizarAcoesEmSegundoPlano(): void {
    const client = this.supabase.client;
    if (!client || this.sincronizacaoAcoesIniciada) return;
    this.sincronizacaoAcoesIniciada = true;
    void client.from('pedagogical_actions').select('*').order('action_date', { ascending: false }).then(({ data, error }) => {
      if (!error && data?.length) {
        this.cacheAcoes = data.map(this.mapearAcao);
        this.salvarLocal(this.chaveAcoes, this.cacheAcoes);
        this.acoesSincronizadas.next(this.cacheAcoes);
      }
    });
  }

  private sincronizarCompromissosEmSegundoPlano(): void {
    const client = this.supabase.client;
    if (!client || this.sincronizacaoCompromissosIniciada) return;
    this.sincronizacaoCompromissosIniciada = true;
    void client.from('appointments').select('*').order('event_date').order('event_time').then(({ data, error }) => {
      if (!error && data?.length) {
        this.cacheCompromissos = data.map(this.mapearCompromisso);
        this.salvarLocal(this.chaveCompromissos, this.cacheCompromissos);
        this.compromissosSincronizados.next(this.cacheCompromissos);
      }
    });
  }

  private mapearAluno = (row: any): Aluno => {
    const media = Number(row.grade_average);
    return {
      id: row.id, nome: row.name, cpfMascarado: row.masked_cpf, ano: row.school_year,
      turma: row.class_group, turno: row.shift, frequencia: Number(row.attendance),
      media, faltas: row.month_absences, desmotivacao: row.disengaged,
      necessidadeTrabalhar: row.needs_to_work, problemaTransporte: row.transport_issue,
      acompanhamentoFamiliar: row.family_support, status: row.follow_up_status,
      prioridade: row.attention_level, pontuacao: row.attention_score, motivos: row.reasons ?? [],
      tendenciaFrequencia: (row.attendance_trend ?? []).map(Number),
      mediasBimestrais: row.grade_trend?.length ? row.grade_trend.map(Number) : [media]
    };
  };

  private mapearAcao = (row: any): AcaoPedagogica => ({
    id: row.id, alunoId: row.student_id, tipo: row.action_type, titulo: row.title,
    responsavel: row.responsible, data: row.action_date, status: row.status,
    descricao: row.description, tags: row.tags ?? undefined
  });

  private mapearCompromisso = (row: any): Compromisso => ({
    id: row.id, alunoId: row.student_id ?? undefined, titulo: row.title,
    descricao: row.description ?? '', data: row.event_date, hora: String(row.event_time).slice(0, 5),
    tipo: row.appointment_type, prioridade: row.priority, responsavel: row.responsible,
    concluido: row.completed
  });
}
