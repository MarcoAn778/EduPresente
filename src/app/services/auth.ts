import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tempoLimiteLoginMs = 10000;
  private readonly chaveSessao = 'edupresente_auth';
  private readonly usuarioPadrao = 'coordenador@escola.com';
  private readonly senhaPadrao = '123456';
  private readonly supabase = inject(SupabaseService);
  private autenticado?: boolean;
  private manterConectado = false;

  async login(email: string, senha: string, manterConectado = false): Promise<boolean> {
    this.manterConectado = manterConectado;
    this.supabase.configurarPersistencia(manterConectado);
    const client = this.supabase.client;
    if (client) {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      try {
        const limite = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Tempo limite do login excedido')), this.tempoLimiteLoginMs);
        });
        const autenticacao = Promise.resolve().then(() =>
          client.auth.signInWithPassword({ email: email.trim(), password: senha })
        );
        const { data, error } = await Promise.race([limite, autenticacao]);
        const autenticado = !error && Boolean(data.session);
        this.autenticado = autenticado;
        return autenticado;
      } catch (erro) {
        this.autenticado = false;
        throw erro;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    const autenticado = email.trim() === this.usuarioPadrao && senha === this.senhaPadrao;
    this.autenticado = autenticado;
    this.marcarSessao(autenticado, manterConectado);
    return autenticado;
  }

  async estaAutenticado(): Promise<boolean> {
    if (this.autenticado !== undefined) return this.autenticado;
    const client = this.supabase.client;
    if (client) {
      const { data } = await client.auth.getSession();
      const autenticado = Boolean(data.session);
      this.autenticado = autenticado;
      return autenticado;
    }
    this.autenticado = typeof localStorage !== 'undefined' &&
      (localStorage.getItem(this.chaveSessao) === 'true' || sessionStorage.getItem(this.chaveSessao) === 'true');
    return this.autenticado;
  }

  async logout(): Promise<void> {
    await this.supabase.client?.auth.signOut();
    this.marcarSessao(false, false);
    this.autenticado = false;
  }

  async alterarSenha(novaSenha: string): Promise<boolean> {
    if (novaSenha.length < 6) return false;
    const client = this.supabase.client;
    if (!client) return true;
    const { error } = await client.auth.updateUser({ password: novaSenha });
    return !error;
  }

  private marcarSessao(ativa: boolean, persistir: boolean): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.chaveSessao);
    sessionStorage.removeItem(this.chaveSessao);
    if (ativa) (persistir ? localStorage : sessionStorage).setItem(this.chaveSessao, 'true');
  }
}
