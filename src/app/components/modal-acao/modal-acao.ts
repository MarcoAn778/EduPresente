import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-acao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-acao.html'
})
export class ModalAcaoComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @Input() nomeAluno: string = ''; // Nome do aluno se vier de um contexto específico

  abrir() {
    this.modal.nativeElement.showModal();
  }

  fechar() {
    this.modal.nativeElement.close();
  }
}