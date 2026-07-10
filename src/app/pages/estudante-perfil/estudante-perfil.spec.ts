import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudantePerfil } from './estudante-perfil';

describe('EstudantePerfil', () => {
  let component: EstudantePerfil;
  let fixture: ComponentFixture<EstudantePerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudantePerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudantePerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
