import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcao } from './modal-acao';

describe('ModalAcao', () => {
  let component: ModalAcao;
  let fixture: ComponentFixture<ModalAcao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAcao],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAcao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
