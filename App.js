//Requerir y establecer todas las variables de entorno
require("dotenv").config()

const Server = require("./models/server")

const server = new Server();


server.listen();