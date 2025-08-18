import { Inject, inject } from "@angular/core";
import { Router } from "@angular/router";
import { STORAGE_KEYS } from "../constants/storage";
import { NotificationService } from "../services/notification.service";

export const UserGuard = () =>{

    const token = localStorage.getItem(`${STORAGE_KEYS.TOKEN}`);

    const router = inject(Router);

    const notificationService = inject(NotificationService);


    if(!token){

        notificationService.error('Debes de iniciar sesión para poder acceder a esta ruta');

        router.navigate(['/login']);

        return false;

    }

    return true;



}


