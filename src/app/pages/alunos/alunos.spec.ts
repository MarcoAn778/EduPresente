import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alunos } from './alunos';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

describe('Alunos', () => {
  let component: Alunos;
  let fixture: ComponentFixture<Alunos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alunos],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ atencao: 'Leve' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Alunos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o filtro recebido pela URL', () => {
    fixture.detectChanges();

    expect(component.atencao).toBe('Leve');
    expect(component.alunosFiltrados.length).toBeGreaterThan(0);
    expect(component.alunosFiltrados.every(aluno => aluno.prioridade === 'Leve')).toBe(true);
  });
});
