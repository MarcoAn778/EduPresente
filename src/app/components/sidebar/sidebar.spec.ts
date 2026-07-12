import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar';
import { provideRouter, Router } from '@angular/router';

describe('Sidebar', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve manter Alunos ativo nas telas de perfil e histórico', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'url', 'get').mockReturnValue('/app/perfil/10000000-0000-4000-8000-000000000001');

    expect(component.paginaMobileAtiva('alunos')).toBe(true);
    expect(component.paginaMobileAtiva('inicio')).toBe(false);
  });
});
