import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // add auth header with jwt if user is logged in and request is to the api url
  const accountService = inject(AccountService);
  const user = accountService.userValue;
  const isLoggedIn = user && user.token;
  const isApiUrl = request.url.startsWith("/api");
  if (isLoggedIn && isApiUrl) {
    request = request.clone({ setHeaders: { Authorization: `Bearer ${user.token}` } });
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        accountService.logout();
      }
      return throwError(error);
    })
  );
}
