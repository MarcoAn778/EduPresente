import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly configurado = Boolean(environment.supabaseUrl && environment.supabaseAnonKey);
  private instancia?: SupabaseClient;
  private manterSessao = false;
  private persistenciaDefinida = false;
  private readonly armazenamentoSessao = {
    getItem: (chave: string): string | null => {
      if (typeof localStorage === 'undefined') return null;
      const sessaoPersistente = localStorage.getItem(chave);
      if (sessaoPersistente && !this.persistenciaDefinida) this.manterSessao = true;
      return sessaoPersistente ?? sessionStorage.getItem(chave);
    },
    setItem: (chave: string, valor: string): void => {
      if (typeof localStorage === 'undefined') return;
      const destino = this.manterSessao ? localStorage : sessionStorage;
      const alternativo = this.manterSessao ? sessionStorage : localStorage;
      alternativo.removeItem(chave);
      destino.setItem(chave, valor);
    },
    removeItem: (chave: string): void => {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(chave);
      sessionStorage.removeItem(chave);
    }
  };

  configurarPersistencia(manterConectado: boolean): void {
    this.persistenciaDefinida = true;
    this.manterSessao = manterConectado;
  }

  get client(): SupabaseClient | null {
    if (!this.configurado) return null;
    this.instancia ??= createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: this.armazenamentoSessao
      }
    });
    return this.instancia;
  }
}
