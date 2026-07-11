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
});
