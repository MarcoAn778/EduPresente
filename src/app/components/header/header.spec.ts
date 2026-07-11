import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data-driven notifications near the bell', () => {
    fixture.detectChanges();
    expect(component.notificacoes.length).toBeGreaterThan(0);
    component.alternarPainel(new MouseEvent('click'));
    expect(component.painelAberto).toBe(true);
    expect(component.naoLidas).toBeGreaterThan(0);
  });
});
