import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historico } from './historico';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

describe('Historico', () => {
  let component: Historico;
  let fixture: ComponentFixture<Historico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historico],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '10000000-0000-4000-8000-000000000001' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Historico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate different summaries from student indicators', () => {
    fixture.detectChanges();
    expect(component.resumoPeriodo.destaque).toBe('Intervenção pedagógica recomendada');

    component.aluno = {
      ...component.aluno!,
      frequencia: 82,
      media: 7.1,
      prioridade: 'Leve',
      tendenciaFrequencia: [70, 75, 82],
    };
    expect(component.resumoPeriodo.destaque).toBe('Evolução positiva observada');

    component.aluno = {
      ...component.aluno!,
      frequencia: 90,
      media: 7.5,
      prioridade: 'Leve',
      tendenciaFrequencia: [89, 90, 90],
    };
    expect(component.resumoPeriodo.destaque).toBe('Cenário estável em observação');
  });
});
