import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

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
    path: 'lgpd',
    loadComponent: () => import('./pages/lgpd/lgpd').then(m => m.Lgpd)
  },
  {
    path: 'app',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
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
        path: 'agenda',
        loadComponent: () =>
          import('./pages/agenda/agenda').then(m => m.Agenda)
      },
      {
        path: 'perfil/:id',
        loadComponent: () =>
          import('./pages/estudante-perfil/estudante-perfil').then(m => m.EstudantePerfil)
      },
      {
        path: 'historico/:id',
        loadComponent: () =>
          import('./pages/historico/historico').then(m => m.Historico)
      },
      {
        path: 'lgpd',
        loadComponent: () =>
          import('./pages/lgpd/lgpd').then(m => m.Lgpd)
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./pages/configuracoes/configuracoes').then(m => m.Configuracoes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
