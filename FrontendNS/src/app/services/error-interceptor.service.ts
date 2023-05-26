import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { AlertifyService } from "./alertify.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(private alertify: AlertifyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);
        console.log(error);
        this.alertify.error(errorMessage);
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
