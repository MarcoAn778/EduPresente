import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface PreferenciasAplicacao {
  temaEscuro: boolean;
  fonteGrande: boolean;
  reduzirAnimacoes: boolean;
  mostrarDicas: boolean;
  alertaPrioridade: boolean;
  acoesPendentes: boolean;
  baixaFrequencia: boolean;
  exigirTermos: boolean;
  frequenciaResumo: string;
}

export interface PerfilEquipe {
  nome: string;
  email: string;
  escola: string;
  cargo: string;
}

const PREFERENCIAS_PADRAO: PreferenciasAplicacao = {
  temaEscuro: false, fonteGrande: false, reduzirAnimacoes: false, mostrarDicas: true,
  alertaPrioridade: true, acoesPendentes: true, baixaFrequencia: false,
  exigirTermos: true, frequenciaResumo: 'Semanalmente (Sexta-feira)'
};

const PERFIL_PADRAO: PerfilEquipe = {
  nome: 'Coordenação Pedagógica', email: 'coordenador@escola.com',
  escola: 'Escola Estadual Promove', cargo: 'Coordenação Pedagógica'
};

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chavePreferencias = 'edupresente_preferencias';
  private readonly chavePerfil = 'edupresente_perfil';
  private readonly preferenciasSignal = signal<PreferenciasAplicacao>(PREFERENCIAS_PADRAO);
  private readonly perfilSignal = signal<PerfilEquipe>(PERFIL_PADRAO);
  readonly preferencias = this.preferenciasSignal.asReadonly();
  readonly perfil = this.perfilSignal.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.preferenciasSignal.set(this.ler(this.chavePreferencias, PREFERENCIAS_PADRAO));
    this.perfilSignal.set(this.ler(this.chavePerfil, PERFIL_PADRAO));
    this.aplicarInterface(this.preferenciasSignal());
  }

  salvarPreferencias(preferencias: PreferenciasAplicacao): void {
    const copia = { ...preferencias };
    this.preferenciasSignal.set(copia);
    this.salvar(this.chavePreferencias, copia);
    this.aplicarInterface(copia);
  }

  salvarPerfil(perfil: PerfilEquipe): void {
    const copia = { ...perfil };
    this.perfilSignal.set(copia);
    this.salvar(this.chavePerfil, copia);
  }

  restaurar(): void {
    this.preferenciasSignal.set(PREFERENCIAS_PADRAO);
    this.perfilSignal.set(PERFIL_PADRAO);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.chavePreferencias);
      localStorage.removeItem(this.chavePerfil);
      this.aplicarInterface(PREFERENCIAS_PADRAO);
    }
  }

  private aplicarInterface(preferencias: PreferenciasAplicacao): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const raiz = document.documentElement.classList;
    raiz.toggle('edupresente-dark', preferencias.temaEscuro);
    raiz.toggle('edupresente-fonte-grande', preferencias.fonteGrande);
    raiz.toggle('edupresente-reduzir-animacoes', preferencias.reduzirAnimacoes);
    raiz.toggle('edupresente-dicas', preferencias.mostrarDicas);
  }

  private ler<T>(chave: string, padrao: T): T {
    try { const valor = localStorage.getItem(chave); return valor ? { ...padrao, ...JSON.parse(valor) } : { ...padrao }; }
    catch { return { ...padrao }; }
  }
  private salvar<T>(chave: string, valor: T): void { if (isPlatformBrowser(this.platformId)) localStorage.setItem(chave, JSON.stringify(valor)); }
}
