const express = require("express");
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config({ quiet: true });
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3000;

let clientsNumbers = [];

app.use(express.static('public')); // Carrega os arquivos estáticos em 'public'

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')) });
app.get('/admin', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'admin.html')) });
app.get('/draw', (req, res) => { res.send(drawWinner()) });

server.listen(APP_PORT, () => {
    console.log(`App executando na porta ${APP_PORT}`);
});

wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.slice(1));
    const token = params.get('token');

    if (token === process.env.ADMIN_TOKEN) {
        ws.isAdmin = true;
        console.log('Admin conectado');
    } else {
        ws.isAdmin = false;
        let number = generateCode(ws, 100);
        ws.send(JSON.stringify({ type: 'clientNumber', data: number }));
    }

    updateClientsCount();

    ws.on('message', message => console.log("Mensagem: " + message));

    ws.on('close', () => {
        clientsNumbers = clientsNumbers.filter(number => number !== ws.code);
        console.log("Conexão Fechada");
    });
});

function generateCode(ws, size) {
    let randomNumber = Math.floor(Math.random() * size) + 1;
    ws.code = randomNumber;
    clientsNumbers.push(randomNumber);
    return randomNumber;
}

function drawWinner() {
    let randomNumber = clientsNumbers[Math.floor(Math.random() * clientsNumbers.length)];
    let winner = Array.from(wss.clients).find(client => client.code === randomNumber);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (client === winner) {
                client.send(JSON.stringify({ type: 'status-draw', data: true }));
            } else {
                client.send(JSON.stringify({ type: 'status-draw', data: false }));
            }
        }
    });
}

function updateClientsCount() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (client.isAdmin === true) { client.send(JSON.stringify({ type: 'admin', data: clientsNumbers.length })) }
        }
    });
}