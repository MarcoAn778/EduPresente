import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../services/layout';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ModalAcaoComponent } from '../modal-acao/modal-acao';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalAcaoComponent],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  @ViewChild(ModalAcaoComponent) modalAcao?: ModalAcaoComponent;
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  toggleSidebar(): void {
    this.layoutService.alternarSidebar();
  }

  abrirNovaAcao(): void {
    this.modalAcao?.abrir();
  }

  async sair(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
