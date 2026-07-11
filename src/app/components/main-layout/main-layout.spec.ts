import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComponent } from './main-layout';
import { provideRouter } from '@angular/router';

describe('MainLayout', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve permitir rolagem vertical do conteúdo em telas pequenas', () => {
    fixture.detectChanges();

    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    const conteiner: HTMLElement = main.parentElement as HTMLElement;

    expect(conteiner.classList.contains('min-h-0')).toBe(true);
    expect(main.classList.contains('min-h-0')).toBe(true);
    expect(main.classList.contains('overflow-y-auto')).toBe(true);
  });
});
