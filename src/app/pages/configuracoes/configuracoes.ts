import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DadosService } from '../../services/dados';
import { AuthService } from '../../services/auth';
import { PerfilEquipe, PreferenciasAplicacao, PreferenciasService } from '../../services/preferencias';

@Component({ selector: 'app-configuracoes', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './configuracoes.html' })
export class Configuracoes implements OnInit {
  private readonly dados = inject(DadosService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly preferenciasService = inject(PreferenciasService);

  opcoes!: PreferenciasAplicacao;
  perfil!: PerfilEquipe;
  editandoPerfil = false;
  alterandoSenha = false;
  novaSenha = '';
  confirmarSenha = '';
  mensagemSenha = '';

  ngOnInit(): void {
    this.opcoes = { ...this.preferenciasService.preferencias() };
    this.perfil = { ...this.preferenciasService.perfil() };
  }
  salvarPreferencias(): void { this.preferenciasService.salvarPreferencias(this.opcoes); }
  editarPerfil(): void { this.editandoPerfil = !this.editandoPerfil; }
  salvarPerfil(): void { this.preferenciasService.salvarPerfil(this.perfil); this.editandoPerfil = false; }
  cancelarPerfil(): void { this.perfil = { ...this.preferenciasService.perfil() }; this.editandoPerfil = false; }
  async verLgpd(): Promise<void> { await this.router.navigate(['/app/lgpd']); }
  alterarSenha(): void { this.alterandoSenha = !this.alterandoSenha; this.mensagemSenha = ''; }
  async salvarSenha(): Promise<void> {
    if (this.novaSenha.length < 6 || this.novaSenha !== this.confirmarSenha) {
      this.mensagemSenha = 'As senhas devem ser iguais e possuir pelo menos 6 caracteres.';
      return;
    }
    const sucesso = await this.auth.alterarSenha(this.novaSenha);
    this.mensagemSenha = sucesso ? 'Senha atualizada com sucesso.' : 'Não foi possível atualizar a senha.';
    if (sucesso) { this.novaSenha = this.confirmarSenha = ''; this.alterandoSenha = false; }
  }
  restaurar(): void {
    if (window.confirm('Restaurar os dados e preferências originais?')) {
      this.dados.restaurarDadosSimulados();
      this.preferenciasService.restaurar();
      window.location.reload();
    }
  }
  exportar(): void {
    const relatorio = { estudantes: this.dados.listarAlunos(), acoes: this.dados.listarAcoes(), compromissos: this.dados.listarCompromissos(), preferencias: this.opcoes };
    const url = URL.createObjectURL(new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'edupresente-relatorio-demonstrativo.json'; link.click(); URL.revokeObjectURL(url);
  }
}
