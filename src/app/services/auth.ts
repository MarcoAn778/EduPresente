import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly chaveSessao = 'edupresente_auth';
  private readonly usuarioPadrao = 'coordenador@escola.com';
  private readonly senhaPadrao = '123456';
  private readonly supabase = inject(SupabaseService);
  private autenticado?: boolean;

  async login(email: string, senha: string): Promise<boolean> {
    const client = this.supabase.client;
    if (client) {
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error || !data.session) return false;
      this.autenticado = true;
      this.marcarSessao(true);
      return true;
    }

    const autenticado = email.trim() === this.usuarioPadrao && senha === this.senhaPadrao;
    this.autenticado = autenticado;
    this.marcarSessao(autenticado);
    return autenticado;
  }

  async estaAutenticado(): Promise<boolean> {
    if (this.autenticado !== undefined) return this.autenticado;
    const client = this.supabase.client;
    if (client) {
      const { data } = await client.auth.getSession();
      const autenticado = Boolean(data.session);
      this.autenticado = autenticado;
      this.marcarSessao(autenticado);
      return autenticado;
    }
    this.autenticado = typeof localStorage !== 'undefined' && localStorage.getItem(this.chaveSessao) === 'true';
    return this.autenticado;
  }

  async logout(): Promise<void> {
    await this.supabase.client?.auth.signOut();
    this.marcarSessao(false);
    this.autenticado = false;
  }

  async alterarSenha(novaSenha: string): Promise<boolean> {
    if (novaSenha.length < 6) return false;
    const client = this.supabase.client;
    if (!client) return true;
    const { error } = await client.auth.updateUser({ password: novaSenha });
    return !error;
  }

  private marcarSessao(ativa: boolean): void {
    if (typeof localStorage === 'undefined') return;
    if (ativa) localStorage.setItem(this.chaveSessao, 'true');
    else localStorage.removeItem(this.chaveSessao);
  }
}
