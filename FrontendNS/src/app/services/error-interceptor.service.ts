import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { AlertifyService } from "./alertify.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(
    private alertify: AlertifyService,
    private router: Router
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);
        console.log(errorMessage);
        if (error.status == 400 && error.error === 'Invalid token' && this.router.url !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('user');

          this.router.navigate(['/login']);
          this.alertify.error('Your token is either invalid or expired. Login to receive a new token.');
        } else {
          this.alertify.error(errorMessage);
        }
        return throwError(errorMessage);
      })
    );
  }

  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Unknown error occured';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status !== 0) {
        errorMessage = error.error;
      }
    }
    return errorMessage;
  }
}
