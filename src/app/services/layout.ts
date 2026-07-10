import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  sidebarRecolhida = signal<boolean>(true);

  alternarSidebar(): void {
    this.sidebarRecolhida.update(estado => !estado);
  }
}