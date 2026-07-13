import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lgpd } from './lgpd';

describe('Lgpd', () => {
  let component: Lgpd;
  let fixture: ComponentFixture<Lgpd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lgpd],
    }).compileComponents();

    fixture = TestBed.createComponent(Lgpd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve apresentar uma política de privacidade com linguagem institucional', () => {
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;

    expect(texto).toContain('Governança de Dados');
    expect(texto).toContain('Minimização e qualidade dos dados');
    expect(texto).not.toContain('protótipo acadêmico');
    expect(texto).not.toContain('Dados simulados');
  });
});
