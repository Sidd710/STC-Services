import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(async (event) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body?.status === 0 && body?.msg === 'Token mismatch') {
            await this.handleLogout();
          }
        }
      })
    );
  }

  private async handleLogout() {
    await localStorage.clear();  // Clear token and cache
    this.router.navigate(['/login']); // Redirect to login page
  }
}
