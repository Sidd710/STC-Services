import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl; // Use base URL from environment

  constructor(private http: HttpClient) {}
  private getHeaders(skipToken: boolean = false) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem('token');
     if (token && !skipToken) {
      headers = headers.set('token', token); // ✅ Use lowercase 'token'
    }

    return { headers };
  }

  private getHeadersForPhoto(skipToken: boolean = false) {
    let headers = new HttpHeaders();

    const token = localStorage.getItem('token');
     if (token && !skipToken) {
      headers = headers.set('token', token); // ✅ Use lowercase 'token'
    }
    

    return { headers };
  }

  // Generic GET request
  get<T>(endpoint: string,skipToken: boolean = false): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, this.getHeaders(skipToken));
  }
  

  // Generic POST request
  post<T>(endpoint: string, data: any,skipToken: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, this.getHeaders(skipToken));
  }
 
  postPhoto<T>(endpoint: string, data: any,skipToken: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, this.getHeadersForPhoto(skipToken));
  }
  // Generic PUT request
  put<T>(endpoint: string, data: any,skipToken: boolean = false): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data,this.getHeaders(skipToken));
  }

  // Generic DELETE request
  delete<T>(endpoint: string,skipToken: boolean = false): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, this.getHeaders(skipToken));
  }
  deleteComplaint<T>(endpoint: string,data:any,skipToken: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`,data, this.getHeaders(skipToken));
  }
}
