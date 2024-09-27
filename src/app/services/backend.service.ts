import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { BackendResponse } from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private backendUri = environment.backendUri;

  constructor(private http: HttpClient) {}

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getApiCall(route: string): Observable<BackendResponse> {
    return this.http
      .get<BackendResponse>(this.backendUri + route, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          throw error;
        })
      );
  }

  postApiCall(route: string, payload: any): Observable<BackendResponse> {
    return this.http
      .post<BackendResponse>(this.backendUri + route, payload, {
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          throw error;
        })
      );
  }
}
