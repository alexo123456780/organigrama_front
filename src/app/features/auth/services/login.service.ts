import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { API_KEYS } from '../../../core/constants/endpoints';
import { LoginRequest } from '../models/usuario.request';
import { UsuarioResponse } from '../models/usuario.response';
import { Usuario, UserRole } from '../models/usuario';
import { STORAGE_KEYS } from '../../../core/constants/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_URL = environment.api_url;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http:HttpClient) { }

  login(credenciales:LoginRequest):Observable<UsuarioResponse>{

    return this.http.post<UsuarioResponse>(`${this.API_URL}/${API_KEYS.AUTH.LOGIN}`,credenciales).pipe(

      map(response =>{

        if(response.access_token && response.user){

          localStorage.setItem(`${STORAGE_KEYS.TOKEN}`, response.access_token);
          localStorage.setItem(`${STORAGE_KEYS.USER}`, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);

        }

        return response;

      })
    )

  }

  getCurrentUser(): Usuario | null {
    const userData = localStorage.getItem(`${STORAGE_KEYS.USER}`);
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.rol : null;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.userName : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(`${STORAGE_KEYS.TOKEN}`) && !!this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem(`${STORAGE_KEYS.TOKEN}`);
    localStorage.removeItem(`${STORAGE_KEYS.USER}`);
    this.currentUserSubject.next(null);
  }


  
  
}
