import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o ícone e o texto corretos ao alternar a senha', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#senha');
    const botao: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Mostrar senha"]',
    );

    expect(input.type).toBe('password');
    expect(botao).toBeTruthy();

    botao.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
    expect(fixture.nativeElement.querySelector('button[aria-label="Ocultar senha"]')).toBeTruthy();
  });

  it('deve encerrar o carregamento e informar credenciais inválidas', async () => {
    authServiceMock.login.mockResolvedValue(false);
    component.loginForm.patchValue({ email: 'teste@escola.com', senha: 'incorreta', termos: true });

    await component.onSubmit();
    fixture.detectChanges();

    expect(component.processando).toBe(false);
    expect(component.erroLogin).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('E-mail ou senha incorretos');
  });

  it('deve encerrar o carregamento e informar falha de conexão', async () => {
    authServiceMock.login.mockRejectedValue(new Error('Falha de rede'));
    component.loginForm.patchValue({ email: 'teste@escola.com', senha: '123456', termos: true });

    await component.onSubmit();
    fixture.detectChanges();

    expect(component.processando).toBe(false);
    expect(component.erroLogin).toBe(true);
    expect(component.mensagemErro).toContain('Verifique sua conexão');
  });
});
