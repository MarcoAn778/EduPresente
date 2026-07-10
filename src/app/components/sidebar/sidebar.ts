import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../services/layout';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  layoutService = inject(LayoutService);

  toggleSidebar(): void {
    this.layoutService.alternarSidebar();
  }
}