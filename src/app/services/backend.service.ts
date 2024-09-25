import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public backendUri = environment.backendUri;
  constructor(private http: HttpClient) {}
  public headers = new HttpHeaders({});
  getApiCall<T>(route: string): Observable<T> {
    return this.http.get<T>(this.backendUri + route);
  }
  postApiCall<T>(route: string, payload: any): Observable<T> {
    return this.http.post<T>(this.backendUri + route, payload);
  }
}
