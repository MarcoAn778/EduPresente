import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agenda } from './agenda';

describe('Agenda', () => {
  let component: Agenda;
  let fixture: ComponentFixture<Agenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Agenda] }).compileComponents();
    fixture = TestBed.createComponent(Agenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render appointments', () => {
    expect(component).toBeTruthy();
    expect(component.compromissos.length).toBeGreaterThan(0);
    expect(component.diasCalendario.length).toBe(42);
  });
});
