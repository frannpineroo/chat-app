const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

const usuarioRoutes = require('./routes/usuario.routes');

const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

//MIDDLEWARES

app.use(cookieParser());
app.use(express.json());
app.use(express.static(publicPath));


// RUTAS HTTP

app.use('/usuarios', usuarioRoutes);


// SOCKETS

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

// SERVIDOR

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});