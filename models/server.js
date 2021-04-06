
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');


class Server{

    //Definir las propiedades
    constructor(){
        this.app = express();
        this.port= process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths ={

            auth:       '/api/auth',
            buscar:     '/api/buscar',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            categorias: '/api/categorias',
            uploads:    '/api/uploads'
        }


        //Conexion base de datos

        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

        //Sockets

        this.sockets();
    }

    //Conectar BD

    async conectarDB (){
        await dbConection();
    }

    //Definir Middlewares
    middlewares(){
        //CORS
        this.app.use(cors())

        //Lectura y parseo del body

        this.app.use(express.json());

        //Directorio Público 
        this.app.use(express.static('public'));

        //carga de archivos 

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    //Definir rutas
    routes(){

        //Cargar las rutas de un usuario 
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.uploads, require('../routes/upload'));
        
    }

    //sockets

    sockets(){
        this.io.on("connection", socketController );
    }

    //Definir metodo para empezar el server
    listen(){
        this.server.listen(this.port, ()=>{
            console.log('Servidor Corriendo en puerto' , this.port);
        });
    }

}


module.exports = Server;