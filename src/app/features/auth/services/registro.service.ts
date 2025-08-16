import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { API_KEYS } from '../../../core/constants/endpoints';
import { RegistroRequest } from '../models/usuario.request';
import { UsuarioResponse } from '../models/usuario.response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private API_URL = environment.api_url;

  constructor(private http:HttpClient){}

  registro(request:RegistroRequest):Observable<UsuarioResponse>{

    return this.http.post<UsuarioResponse>(`${this.API_URL}/${API_KEYS.AUTH.REGISTRO}`,request).pipe(

      map(response =>{

        return response;

      })

    )

  }

  
}
