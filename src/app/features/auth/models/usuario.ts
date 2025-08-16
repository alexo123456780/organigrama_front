export interface Usuario {

    id:number;
    userName: string;
    password: string;
    rol: UserRole;
    estaActivo: boolean;
    createdAt: string;
    updatedAt: string;


}

export enum UserRole{

    Administrador = 'admin',
    Editor = 'editor',
    Viewer = 'view'


}