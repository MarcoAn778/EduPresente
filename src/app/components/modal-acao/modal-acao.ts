import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DadosService } from '../../services/dados';
import { Aluno, NovaAcao, StatusAcao } from '../../models/edupresente.models';

@Component({ selector: 'app-modal-acao', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './modal-acao.html' })
export class ModalAcaoComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @Input() nomeAluno = '';
  @Input() alunoId = '';
  @Output() acaoSalva = new EventEmitter<void>();
  private readonly dados = inject(DadosService);
  alunos: Aluno[] = [];
  buscaAluno = '';
  listaAlunosAberta = false;
  salvando = false;
  erro = '';
  formulario: NovaAcao = { alunoId: '', tipo: 'contato', responsavel: '', data: new Date().toISOString().slice(0, 10), status: 'Pendente', descricao: '' };

  abrir(): void {
    this.alunos = this.dados.listarAlunos();
    this.formulario.alunoId = this.alunoId;
    this.buscaAluno = this.nomeAluno;
    this.listaAlunosAberta = !this.nomeAluno;
    this.modal.nativeElement.showModal();
  }
  fechar(): void { this.listaAlunosAberta = false; this.modal.nativeElement.close(); }
  get alunosFiltrados(): Aluno[] {
    const termo = this.buscaAluno.trim().toLocaleLowerCase('pt-BR');
    return termo ? this.alunos.filter(aluno => aluno.nome.toLocaleLowerCase('pt-BR').includes(termo)) : this.alunos;
  }
  selecionarAluno(aluno: Aluno): void {
    this.formulario.alunoId = aluno.id;
    this.buscaAluno = aluno.nome;
    this.listaAlunosAberta = false;
  }
  selecionarStatus(status: StatusAcao): void { this.formulario.status = status; }
  async salvar(): Promise<void> {
    if (!this.formulario.alunoId || !this.formulario.responsavel || !this.formulario.descricao) {
      this.erro = 'Preencha estudante, responsável e observação.';
      return;
    }
    this.salvando = true;
    this.erro = '';
    try {
      await this.dados.registrarAcao(this.formulario);
      this.acaoSalva.emit();
      this.fechar();
    } catch {
      this.erro = 'Não foi possível salvar a ação. Tente novamente.';
    } finally { this.salvando = false; }
  }
}
