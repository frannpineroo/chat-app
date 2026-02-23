const chatRouter = require('./controllers/ChatController.js');

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');


const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public/pages');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicPath));

app.use('/api/chat', chatRouter);

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');





server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});