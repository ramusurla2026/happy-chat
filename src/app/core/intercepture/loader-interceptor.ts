// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { finalize } from 'rxjs';
// import { Loader } from '../services/loader';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//     const loader = inject(Loader);

//   loader.show();

//   return next(req).pipe(
//     finalize(() => {
//       loader.hide();
//     })
//   );
// };

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Loader } from '../services/loader';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  const loader = inject(Loader);

  if (req.headers.has('x-skip-loader')) {

    const newReq = req.clone({
      headers: req.headers.delete('x-skip-loader')
    });

    return next(newReq); // loader.show() call avvadu
  }

  loader.show();

  return next(req).pipe(
    finalize(() => loader.hide())
  );
};
