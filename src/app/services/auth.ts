import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly chaveSessao = 'edupresente_auth';
  private readonly usuarioPadrao = 'coordenador@escola.com';
  private readonly senhaPadrao = '123456';

  login(email: string, senha: string): boolean {
    const autenticado = email.trim() === this.usuarioPadrao && senha === this.senhaPadrao;

    if (autenticado) {
      localStorage.setItem(this.chaveSessao, 'true');
    }

    return autenticado;
  }

  estaAutenticado(): boolean {
    return localStorage.getItem(this.chaveSessao) === 'true';
  }

  logout(): void {
    localStorage.removeItem(this.chaveSessao);
  }
}