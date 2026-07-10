import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', 
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./components/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
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
        path: '', // Se acessar apenas /app, redireciona para /app/dashboard [cite: 258]
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**', // Rota coringa para páginas não encontradas [cite: 259]
    redirectTo: 'login'
  }
];