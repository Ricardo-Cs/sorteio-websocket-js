const express = require("express");
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config({ quiet: true });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const APP_PORT = process.env.APP_PORT;

let clientes = []; 

app.use(express.static('public')); // Carrega os arquivos estáticos em 'public'
app.get('/', (req, res) => { res.sendFile(__dirname + "/public/index.html") });
app.get('/admin', (req, res) => { res.sendFile(__dirname + "/public/admin.html") });

server.listen(APP_PORT, () => {
    console.log(`App executando na porta ${APP_PORT}`);
});

wss.on('connection', ws => {
    ws.on('message', () => console.log("Mensagem"));
    clientes.push(ws);

    console.log(`Total de clientes conectados: ${wss.clients.size}`);

    ws.on('close', () => {
        console.log('Saiu');
    })

    ws.on('message', () => console.log("Mensagem"));
});