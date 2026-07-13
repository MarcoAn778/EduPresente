import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { provideRouter } from '@angular/router';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard data immediately', () => {
    fixture.detectChanges();
    expect(component.resumo.total).toBeGreaterThan(0);
    expect(component.alunosPrioritarios.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain(String(component.resumo.total));
  });

  it('should load weekly appointments linked to the agenda', () => {
    fixture.detectChanges();
    expect(component.compromissosSemana.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain(component.compromissosSemana[0].titulo);
  });

  it('deve criar links dos cards de atenção com o filtro correspondente', () => {
    fixture.detectChanges();

    const linkLeve: HTMLAnchorElement | null = fixture.nativeElement.querySelector(
      'a[href*="atencao=Leve"]',
    );
    const cardTotal: HTMLAnchorElement | null = fixture.nativeElement.querySelector(
      '[data-testid="card-total-monitorado"]',
    );
    expect(linkLeve).toBeTruthy();
    expect(cardTotal?.textContent).not.toContain('4%');
  });

  it('deve renderizar e navegar entre as três imagens do carrossel', () => {
    fixture.detectChanges();

    expect(component.slidesCarrossel.length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('section[aria-roledescription="carrossel"] img').length).toBe(3);
    component.proximoSlide();
    fixture.detectChanges();
    expect(component.slideAtual).toBe(1);
    expect(fixture.nativeElement.textContent).toContain(component.slidesCarrossel[1].titulo);
    component.slideAnterior();
    expect(component.slideAtual).toBe(0);
  });
});
