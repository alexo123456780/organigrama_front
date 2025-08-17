import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { API_KEYS } from '../../../core/constants/endpoints';
import { LoginRequest } from '../models/usuario.request';
import { UsuarioResponse } from '../models/usuario.response';
import { STORAGE_KEYS } from '../../../core/constants/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_URL = environment.api_url;

  constructor(private http:HttpClient){}

  login(credenciales:LoginRequest):Observable<UsuarioResponse>{

    return this.http.post<UsuarioResponse>(`${this.API_URL}/${API_KEYS.AUTH.LOGIN}`,credenciales).pipe(

      map(response =>{

        if(response.access_token){

          localStorage.setItem(`${STORAGE_KEYS.TOKEN}`, response.access_token);

        }else{

          console.log('No se encontro un token disponible');

        }

        return response;

      })
    )

  }
  
}
