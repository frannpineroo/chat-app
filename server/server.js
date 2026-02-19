const verificarToken = require('./middlewares/auth.middleware');
const redirigirSiAutenticado = require('./middlewares/redirect.middleware');

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');

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
app.use('/auth', authRoutes);

app.get('/', redirigirSiAutenticado, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/login', redirigirSiAutenticado, (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// Ruta protegida para el perfil del usuario
app.get('/perfil', verificarToken, ( req, res ) => {
    res.sendFile(path.join( publicPath, '../views/perfil.html' ));
})


// SOCKETS

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

// SERVIDOR

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});