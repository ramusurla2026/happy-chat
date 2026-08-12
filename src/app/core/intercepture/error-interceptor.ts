import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastController = inject(ToastController);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      let message = 'Something went wrong';

      if (error.error?.message) {

        message = error.error.message;

      }
      else if (error.status === 0) {

        message = 'Unable to connect to server';

      }
      else if (error.status === 400) {

        message = 'Invalid request';

      }
      else if (error.status === 401) {

        message = 'Session expired. Please login again';

      }
      else if (error.status === 403) {

        message = 'You are not authorized';

      }
      else if (error.status === 404) {

        message = 'Requested data not found';

      }
      else if (error.status === 500) {

        message = 'Server error. Please try again later';

      }

      // Toast display
      toastController.create({
        message: message,
        duration: 2500,
        position: 'bottom',
        color: 'danger'
      }).then(toast => {

        toast.present();

      });

      // VERY IMPORTANT
      // Original error ni Observable ga return cheyyali
      return throwError(() => error);

    })

  );

};