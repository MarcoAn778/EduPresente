import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Configuracoes } from './configuracoes';

describe('Configuracoes', () => {
  let component: Configuracoes;
  let fixture: ComponentFixture<Configuracoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Configuracoes],
    }).compileComponents();

    fixture = TestBed.createComponent(Configuracoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve usar linguagem profissional na gestão de privacidade e dados', () => {
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;

    expect(texto).toContain('Gestão e portabilidade de dados');
    expect(texto).toContain('Consultar política de privacidade');
    expect(texto).not.toContain('Mock');
    expect(texto).not.toContain('dados simulados');
  });
});
