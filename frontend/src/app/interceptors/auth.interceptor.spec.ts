import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let router: jasmine.SpyObj<Router>;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    interceptor = new AuthInterceptor(router);
  });

  it('should clear the token and redirect to login on a 401 error', (done) => {
    const error = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('GET', '/api/data');
    const handler: HttpHandler = {
      handle: () => throwError(() => error),
    };
    const removeToken = spyOn(localStorage, 'removeItem');

    interceptor.intercept(request, handler).subscribe({
      error: (receivedError) => {
        expect(receivedError).toBe(error);
        expect(removeToken).toHaveBeenCalledWith('token');
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      },
    });
  });

  it('should preserve non-401 errors without logging out', (done) => {
    const error = new HttpErrorResponse({ status: 500 });
    const request = new HttpRequest('GET', '/api/data');
    const handler: HttpHandler = {
      handle: () => throwError(() => error),
    };
    const removeToken = spyOn(localStorage, 'removeItem');

    interceptor.intercept(request, handler).subscribe({
      error: (receivedError) => {
        expect(receivedError).toBe(error);
        expect(removeToken).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
