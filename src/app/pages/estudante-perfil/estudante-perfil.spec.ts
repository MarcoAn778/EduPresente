import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudantePerfil } from './estudante-perfil';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

describe('EstudantePerfil', () => {
  let component: EstudantePerfil;
  let fixture: ComponentFixture<EstudantePerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudantePerfil],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '10000000-0000-4000-8000-000000000001' }) } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudantePerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render grade history and recent pedagogical actions from the data service', () => {
    fixture.detectChanges();
    expect(component.aluno?.mediasBimestrais.length).toBeGreaterThan(0);
    expect(component.acoesRecentes.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain(component.acoesRecentes[0].titulo);
  });

  it('deve calcular a variação usando os dois últimos períodos do aluno', () => {
    fixture.detectChanges();

    expect(component.variacaoMedia).toBe(-0.6);
    expect(fixture.nativeElement.textContent).toContain('-0.6 vs período anterior');
  });
});
