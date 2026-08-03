import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = environment.apiUrl;

  private signupUrl = `${this.baseUrl}/auth/signup`;
  private loginUrl = `${this.baseUrl}/auth/login`;
  private refreshUrl = `${this.baseUrl}/refresh-token`;

  constructor(private http: HttpClient) { }

  // Login API
  login(data: any): Observable<any> {
    return this.http.post(this.loginUrl, data);
  }

  signup(data: any): Observable<any> {
    return this.http.post(this.signupUrl, data);
  }

  // Refresh Token API
  refreshToken(): Observable<any> {
    return this.http.post(this.refreshUrl, {
      refreshToken: this.getRefreshToken()
    });
  }

  // Save Tokens
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

 saveLogin(data: any): void {

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', data.user.id);

}

  // Get Access Token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Update only Access Token
  updateAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Check Login
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }


 
}
