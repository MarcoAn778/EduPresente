import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth';
import { SupabaseService } from './supabase';

describe('Auth', () => {
  let service: AuthService;
  let supabaseMock: { client: null; configurarPersistencia: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    supabaseMock = { client: null, configurarPersistencia: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: supabaseMock }],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve persistir o acesso localmente quando manter conectado estiver marcado', async () => {
    expect(await service.login('coordenador@escola.com', '123456', true)).toBe(true);

    expect(supabaseMock.configurarPersistencia).toHaveBeenCalledWith(true);
    expect(localStorage.getItem('edupresente_auth')).toBe('true');
    expect(sessionStorage.getItem('edupresente_auth')).toBeNull();
  });

  it('deve limitar o acesso à aba quando manter conectado estiver desmarcado', async () => {
    expect(await service.login('coordenador@escola.com', '123456', false)).toBe(true);

    expect(supabaseMock.configurarPersistencia).toHaveBeenCalledWith(false);
    expect(sessionStorage.getItem('edupresente_auth')).toBe('true');
    expect(localStorage.getItem('edupresente_auth')).toBeNull();
  });
});
