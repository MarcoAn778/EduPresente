import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'alunos',
    loadComponent: () =>
      import('./pages/alunos/alunos').then(m => m.Alunos)
  },
  {
    path: 'relatorios',
    loadComponent: () =>
      import('./pages/relatorios/relatorios').then(m => m.Relatorios)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];