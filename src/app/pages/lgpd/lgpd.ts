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
}