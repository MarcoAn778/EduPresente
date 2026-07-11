import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { provideRouter } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
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
});
