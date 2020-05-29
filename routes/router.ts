
import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';
import { GraficaData } from '../classes/grafica';
import { Encuesta } from '../classes/encusta';
import { Usuario } from '../classes/usuario';

const router = Router();

const grafica = new GraficaData();

const encuesta = new Encuesta();

// ##------ DERMA REAL

router.post('/agenda-status', ( req: Request, res: Response  ) => {

    const id_cita = Number(req.body.id_cita);
    const email = req.body.user_email;
    const fecha = req.body.fecha;
    const tipo = req.body.tipo;
    const id_medico = req.body.id_medico;
   
    const respuesta ={ cita_change:id_cita,user_email:email,fecha:fecha,tipo:tipo,id_medico:id_medico};



    const server = Server.instance;
    server.io.emit('cambio-agenda',respuesta);


    res.json(respuesta);

});


router.post('/chat-mensaje', ( req: Request, res: Response  ) => {

    const tipo = req.body.tipo;
    const sala = req.body.sala;
    const mensaje = req.body.mesaje;
    const permisos = req.body.permisos;

    let notificar = [];
    if(tipo == 'global')
    {
        for(let usuario of usuariosConectados.getLista())
        {
            if(usuario.id_rol <= permisos)
            {
                notificar.push(usuario.id);
            }
        }
    
    }

    if(tipo == 'esp')
    {
        let usuario = usuariosConectados.getUsuarioEsp(sala.id_destino);
        if( usuario)
        {
            notificar.push(usuario.id)
        }
    }

    const respuesta ={ tipo:tipo,sala:sala,mensaje:mensaje};
    const server = Server.instance;

    for(let notifica of notificar)
    {
        server.io.to(notifica).emit('chat-mensaje',respuesta);
    }


    res.json(respuesta);

});







// ###-------------- EJEMPLOS ---------------

router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json(grafica.getDataGrafica());

});

router.post('/grafica', ( req: Request, res: Response  ) => {

    const mes = req.body.mes;
    const valor     = Number(req.body.valor);

    grafica.ingrementarValor(mes, valor);



    const server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica() );


    res.json(grafica.getDataGrafica());

});


router.get('/encuesta', ( req: Request, res: Response  ) => {

    res.json(encuesta.getDatos());

});

router.post('/encuesta', ( req: Request, res: Response  ) => {

    const opcion = Number(req.body.opcion);
    const valor     = Number(req.body.valor);

    encuesta.ingrementar(opcion,valor);



    const server = Server.instance;
    server.io.emit('cambio-encuesta', encuesta.getDatos());


    res.json(encuesta.getDatos());

});






router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }


    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (  req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[] ) => {

        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            clientes
        });


    });

});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (  req: Request, res: Response ) => {


    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

    
});




export default router;


