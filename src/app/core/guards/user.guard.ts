import { Inject, inject } from "@angular/core";
import { Router } from "@angular/router";
import { STORAGE_KEYS } from "../constants/storage";
import { MensajeService } from "../../services/mensaje.service";

export const UserGuard = () =>{

    const token = localStorage.getItem(`${STORAGE_KEYS.TOKEN}`);

    const router = inject(Router);

    const messageService = inject(MensajeService);


    if(!token){

        messageService.setMensajeErroneo('Debes de iniciar sesion para poder acceder a esta ruta');

        router.navigate(['/login']);

        return false;

    }

    return true;



}


