// src/app/services/auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './apiService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private authState = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.authState.asObservable();
  private userTypeSubject = new BehaviorSubject<string | null>(localStorage.getItem('userType'));
  userType$ = this.userTypeSubject.asObservable(); // Observable to subscribe to userType changes

  constructor(private router: Router, private http: HttpClient,private apiService:ApiService) { }
  private getHeaders(skipToken: boolean = false) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem('token');
    if (token && !skipToken) {
      headers = headers.set('token', token); // ✅ Use lowercase 'token'
    }

    return { headers };
  }
  


  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  getUserType(): string | null {
    return localStorage.getItem('userType'); // Retrieve user type
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  setUserType(userType: string): void {
    localStorage.setItem('userType', userType);
    this.userTypeSubject.next(userType); // Update observable
  }


  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
  // post<T>(endpoint: string, data: any, skipToken: boolean = false): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.getHeaders(skipToken));
  // }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.clear();
    this.authState.next(false); // Notify that user is logged out

    this.router.navigate(['/login']);
  }

  login(credentials: { email_id: string; password: string,fcm_token:string }): Observable<any> {
    return this.apiService.post<any>('auth/login', credentials, true).pipe(
      tap(response => {
        if (response.status) {
          this.authState.next(true); // Notify that user is logged in
          this.setUserType(response.usertype.toString()); // or '2' based on login response

       
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.userdata)); // ✅ Save user data
          localStorage.setItem('userType', response.usertype.toString());
        }
      })
    );
  }
  
  // verifyOtp(otp: string, skipToken = false) {
  //   return this.http.post<any>(`${this.apiUrl}/verifyotp`, { otp }, this.getHeaders(skipToken));
  //   //return true;
  // }

  // resendOtp(email: string) {
  //   return this.http.post<any>(`${this.apiUrl}/resend-otp`, { email }).toPromise();
  // }
}
