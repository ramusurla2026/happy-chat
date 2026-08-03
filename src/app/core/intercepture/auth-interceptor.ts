import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const auth = inject(Auth);

  const accessToken = auth.getAccessToken();

  // Skip Login & Refresh APIs
  if (
    req.url.includes('/login') ||
    req.url.includes('/refresh-token')
  ) {
    return next(req);
  }

  // Add Access Token
  let authRequest = req;

  if (accessToken) {
    authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authRequest).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        return auth.refreshToken().pipe(

          switchMap((response: any) => {

            // Save New Access Token
            auth.updateAccessToken(response.accessToken);

            // Retry Previous Request
            const retryRequest = authRequest.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });

            return next(retryRequest);

          }),

          catchError((refreshError) => {

            // Refresh token failed
            auth.logout();

            return throwError(() => refreshError);

          })

        );

      }

      return throwError(() => error);

    })

  );
};
