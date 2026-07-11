import { TestBed } from '@angular/core/testing';
import { PreferenciasService } from './preferencias';

describe('PreferenciasService', () => {
  it('should persist and apply interface preferences', () => {
    const service = TestBed.inject(PreferenciasService);
    service.salvarPreferencias({ ...service.preferencias(), fonteGrande: true, reduzirAnimacoes: true });
    expect(document.documentElement.classList.contains('edupresente-fonte-grande')).toBe(true);
    expect(document.documentElement.classList.contains('edupresente-reduzir-animacoes')).toBe(true);
    service.restaurar();
  });
});
