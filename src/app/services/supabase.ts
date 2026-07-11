import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly configurado = Boolean(environment.supabaseUrl && environment.supabaseAnonKey);
  private instancia?: SupabaseClient;

  get client(): SupabaseClient | null {
    if (!this.configurado) return null;
    this.instancia ??= createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return this.instancia;
  }
}
