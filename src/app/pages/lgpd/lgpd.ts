import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lgpd',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lgpd.html'
})
export class Lgpd {
  anoAtual = new Date().getFullYear();
  imprimirPolitica(): void { window.print(); }
  revisarLei(): void { window.open('https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', '_blank', 'noopener,noreferrer'); }
}
