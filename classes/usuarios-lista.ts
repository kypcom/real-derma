import { Usuario } from './usuario';
import { userInfo } from 'os';
import { Request } from 'express';




export class UsuariosLista {

    private lista: Usuario[] = [];


    constructor() { }

    // Agregar un usuario
    public agregar( usuario: Usuario ) {

        this.lista.push( usuario );
        console.log( this.lista );
        return usuario
    }

    public actualizarNombre( id: string, nombre: string ,id_user=0,token_api="no-token" ,id_rol=0,url='https://dermaback.kypcom.com') {

        for( let usuario of this.lista ) {

            if ( usuario.id === id ) {
                usuario.nombre = nombre;
                usuario.id_user=id_user;
                usuario.id_rol=id_rol;
                usuario.token_api=token_api;

                const axios = require('axios')

                let query = url+'/api/servicios/users-sockets?token='+usuario.token_api;


        

                axios.post(query,usuario).then((res:any) => {
                    console.log(`statusCode: ${res.status}`)
                    console.log(res.data)
                  })
                  .catch((error:any) => {
                    console.error(error)
                  })

                break;
            }

        }


        console.log('===== Actualizando usuario ====');
        console.log( this.lista );

    }

    // Obtener lista de usuarios
    public getLista() {
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre' );
    }

    // Obtener un usuario
    public getUsuario( id: string ) {

        return this.lista.find( usuario => usuario.id === id );

    }

    // Obtener usuario en especial 
    public getUsuarioEsp( id_user: number ) {

        return this.lista.find( usuario => usuario.id_user === id_user );

    }


    // Obtener usuario en una sala en particular
    public getUsuariosEnSala( sala: string ) {

        return this.lista.filter( usuario =>usuario.sala === sala );

    }

    // Borrar Usuario
    public borrarUsuario( id: string ) {

        const tempUsuario = this.getUsuario( id );

        this.lista = this.lista.filter( usuario => usuario.id !== id );

        return tempUsuario;
        
    }


}