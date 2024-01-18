import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, concatMap, of, retryWhen, throwError } from "rxjs";
import { AlertifyService } from "./alertify.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  ignoredErrors = ['Invalid token'];

  constructor(
    private alertify: AlertifyService,
    private router: Router
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
    .pipe(
      retryWhen(error => this.retryRequest(error, 10)),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);
        if (error.status == 400 && error.error === 'Invalid token' && this.router.url !== '/login') {
          this.logoutUser();
        } else {
          if (!this.ignoredErrors.includes(error.error)) {
            this.alertify.error(errorMessage);
          }
        }
        return throwError(errorMessage);
      })
    );
  }

  retryRequest(error: any, retryCount: number): Observable<unknown> {
    return error.pipe(
      concatMap((checkErr: HttpErrorResponse, count: number) => {
        if (checkErr.status === 0 && count <= retryCount) {
          return of(checkErr);
        }
        return throwError(checkErr);
      })
    )
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
    this.alertify.error('Your token is either invalid or expired. Login to receive a new token.');
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
