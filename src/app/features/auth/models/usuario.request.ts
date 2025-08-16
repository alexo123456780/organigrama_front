import { UserRole } from "./usuario";

export interface LoginRequest{

    userName: string;
    password: string;

}

export interface RegistroRequest{

    userName: string;
    password: string;
    rol?: UserRole | UserRole.Viewer

}