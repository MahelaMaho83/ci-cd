import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the Safebase navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')?.textContent).toContain('Safebase');
  });

  it('should clear the token and navigate to login when logging out', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const removeToken = spyOn(localStorage, 'removeItem');
    const navigate = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.componentInstance.logout();

    expect(removeToken).toHaveBeenCalledWith('token');
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
