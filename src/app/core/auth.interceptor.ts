import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "./services/notification.service";
import { catchError, throwError } from "rxjs";
import { STORAGE_KEYS } from "./constants/storage";


export const AuthInterceptor: HttpInterceptorFn = (req, next) =>{

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    if(token){

        const authReq = req.clone({

            setHeaders: {

                Authorization: `Bearer ${token}`

            }
        });

        return next(authReq).pipe(

            catchError(error => {

                if(error.status === 401 || error.status === 403){

                    localStorage.removeItem(STORAGE_KEYS.TOKEN)

                    notificationService.error('Sesión expirada o token inválido');

                    router.navigate(['/login'])

                }

                return throwError(() => error);

            })
        )

    }

    return next(req);





}
