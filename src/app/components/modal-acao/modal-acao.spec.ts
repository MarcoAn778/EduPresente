import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcaoComponent } from './modal-acao';

describe('ModalAcao', () => {
  let component: ModalAcaoComponent;
  let fixture: ComponentFixture<ModalAcaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAcaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAcaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
