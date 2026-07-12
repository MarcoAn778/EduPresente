import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Aluno } from '../../models/edupresente.models';
import { DadosService } from '../../services/dados';

@Component({ selector: 'app-alunos', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './alunos.html' })
export class Alunos implements OnInit {
  private readonly dados = inject(DadosService);
  private readonly route = inject(ActivatedRoute);
  listaAlunos: Aluno[] = [];
  carregando = true;
  busca = ''; ano = ''; turno = ''; atencao = ''; status = '';
  paginaAtual = 1;
  readonly itensPorPagina = 5;

  ngOnInit(): void {
    const atencao = this.route.snapshot.queryParamMap.get('atencao');
    if (atencao === 'Leve' || atencao === 'Moderada' || atencao === 'Prioritária') this.atencao = atencao;
    this.listaAlunos = this.dados.listarAlunos();
    this.carregando = false;
  }
  get alunosFiltrados(): Aluno[] {
    const termo = this.busca.trim().toLocaleLowerCase('pt-BR');
    return this.listaAlunos.filter(a => (!termo || a.nome.toLocaleLowerCase('pt-BR').includes(termo) || a.cpfMascarado.includes(termo)) && (!this.ano || a.ano === this.ano) && (!this.turno || a.turno === this.turno) && (!this.atencao || a.prioridade === this.atencao) && (!this.status || a.status === this.status));
  }
  get alunosPaginados(): Aluno[] { const inicio = (this.paginaAtual - 1) * this.itensPorPagina; return this.alunosFiltrados.slice(inicio, inicio + this.itensPorPagina); }
  get totalPaginas(): number { return Math.max(1, Math.ceil(this.alunosFiltrados.length / this.itensPorPagina)); }
  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }
  get inicioExibido(): number { return this.alunosFiltrados.length ? (this.paginaAtual - 1) * this.itensPorPagina + 1 : 0; }
  get fimExibido(): number { return Math.min(this.paginaAtual * this.itensPorPagina, this.alunosFiltrados.length); }
  get totalPrioritarios(): number { return this.listaAlunos.filter(a => a.prioridade === 'Prioritária').length; }
  get totalAcompanhamento(): number { return this.listaAlunos.filter(a => a.status === 'Acompanhamento').length; }
  get totalPendentes(): number { return this.listaAlunos.filter(a => a.status === 'Pendente').length; }
  get frequenciaMedia(): number { return this.listaAlunos.reduce((s, a) => s + a.frequencia, 0) / Math.max(this.listaAlunos.length, 1); }
  aplicarFiltros(): void { this.paginaAtual = 1; }
  limparFiltros(): void { this.busca = this.ano = this.turno = this.atencao = this.status = ''; this.paginaAtual = 1; }
  irParaPagina(pagina: number): void { if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaAtual = pagina; }
  exportarRelatorio(): void {
    const linhas = this.alunosFiltrados.map(a => [a.nome, a.ano, a.turma, a.turno, `${a.frequencia}%`, a.media, a.faltas, a.prioridade, a.status]);
    const csv = [['Nome', 'Ano', 'Turma', 'Turno', 'Frequência', 'Média', 'Faltas', 'Atenção', 'Status'], ...linhas].map(linha => linha.map(v => `"${String(v).replaceAll('"', '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'relatorio-estudantes.csv'; link.click(); URL.revokeObjectURL(url);
  }
  getIniciais(nome: string): string { return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase(); }
  getCorIniciais(index: number): string { return ['bg-blue-100 text-[#071e3d]', 'bg-green-100 text-green-700', 'bg-slate-200 text-slate-700'][index % 3]; }
  getBadgeAtencao(n: string): string { return n === 'Prioritária' ? 'bg-red-100 text-red-700' : n === 'Moderada' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'; }
  getDotStatus(s: string): string { return s === 'Pendente' ? 'bg-yellow-400' : s === 'Acompanhamento' ? 'bg-green-600' : 'bg-slate-400'; }
  getCorFrequencia(f: number): string { return f < 70 ? 'text-red-600' : f < 80 ? 'text-yellow-600' : 'text-[#071e3d]'; }
  getBgFrequencia(f: number): string { return f < 70 ? 'bg-red-600' : f < 80 ? 'bg-yellow-500' : 'bg-green-600'; }
}
