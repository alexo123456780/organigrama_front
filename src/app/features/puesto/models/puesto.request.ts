export interface NuevoPuestoRequest{

    nombre:string;
    descripcion:string;
    nivel_jerarquia:number;
    area_departamento:string;
    puesto_superior_id:number;
    status?:boolean | true;
    usuario_creador:string;

}

