import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(() => error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<T>(
      `${path}`,
      JSON.stringify(body),
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(
      `${path}`,
      JSON.stringify(body),
      { headers: this.getHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(
      `${path}`
    ).pipe(catchError(this.formatErrors));
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
}
