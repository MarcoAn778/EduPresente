import { Component, inject } from '@angular/core';
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
  mostrarSenha = false; 
  processando = false;
  readonly exigirTermos: boolean;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private preferenciasService = inject(PreferenciasService);

  constructor() {
    this.exigirTermos = this.preferenciasService.preferencias().exigirTermos;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      termos: [!this.exigirTermos, this.exigirTermos ? Validators.requiredTrue : []]
    });
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.processando = true;
      this.erroLogin = false;
      const { email, senha } = this.loginForm.value;
      const sucesso = await this.authService.login(email, senha);

      if (sucesso) {
        await this.router.navigate(['/app/dashboard']);
      } else {
        this.erroLogin = true;
      }
      this.processando = false;
    }
  }
}
