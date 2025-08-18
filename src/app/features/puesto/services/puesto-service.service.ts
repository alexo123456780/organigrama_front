import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_KEYS } from '../../../core/constants/endpoints';
import { Observable, map } from 'rxjs';
import { PuestoResponse } from '../models/puesto.response';
import { NuevoPuestoRequest } from '../models/puesto.request';

@Injectable({
  providedIn: 'root'
})
export class PuestoServiceService {

  private API_URL = environment.api_url;

  constructor(private http:HttpClient){}

  nuevoPuesto(request: NuevoPuestoRequest):Observable<PuestoResponse>{

    return this.http.post<PuestoResponse>(`${this.API_URL}/${API_KEYS.PUESTOS.CREATE}`,request).pipe(

      map(response =>{

        return response;

      })
    )
  }


  













  
}
