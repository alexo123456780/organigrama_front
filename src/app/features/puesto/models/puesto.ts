export interface Puesto {

    id:number;
    nombre: string;
    descripcion: string;
    nivel_jerarquia:number;
    area_departamento:string;
    status: boolean;
    puesto_superior_id?: number | null;
    fecha_creacion:string;
    fecha_modificacion: string;
    usuario_creador:string;
    usuario_modificador?: string | null;

}


