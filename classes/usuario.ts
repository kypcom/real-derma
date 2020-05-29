

export class Usuario {

    public id: string;
    public nombre: string;
    public sala: string;
    public id_user:number;
    public id_rol:number;
    public token_api:string;


    constructor( id: string ) { 
        
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala   = 'sin-sala';
        this.id_user=0;
        this.id_rol=0;
        this.token_api="no-token";


    }

}