import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { PreferenciasService } from '../../services/preferencias';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  erroLogin = false;
  mensagemErro = '';
  mostrarSenha = false; 
  processando = false;
  readonly exigirTermos: boolean;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private preferenciasService = inject(PreferenciasService);
  private changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.exigirTermos = this.preferenciasService.preferencias().exigirTermos;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      manterConectado: [false],
      termos: [!this.exigirTermos, this.exigirTermos ? Validators.requiredTrue : []]
    });
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.processando) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.processando = true;
    this.erroLogin = false;
    this.mensagemErro = '';
    const { email, senha, manterConectado } = this.loginForm.value;

    try {
      const sucesso = await this.authService.login(email, senha, Boolean(manterConectado));
      if (sucesso) {
        await this.router.navigate(['/app/dashboard']);
      } else {
        this.erroLogin = true;
        this.mensagemErro = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
      }
    } catch {
      this.erroLogin = true;
      this.mensagemErro = 'Não foi possível entrar agora. Verifique sua conexão e tente novamente.';
    } finally {
      this.processando = false;
      this.changeDetector.markForCheck();
    }
  }
}
