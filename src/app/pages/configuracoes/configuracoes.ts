import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracoes.html'
})
export class Configuracoes {
  opcoes = {
    temaEscuro: false,
    fonteGrande: false,
    reduzirAnimacoes: false,
    mostrarDicas: true,
    alertaPrioridade: true,
    acoesPendentes: true,
    baixaFrequencia: false,
    exigirTermos: true
  };
}