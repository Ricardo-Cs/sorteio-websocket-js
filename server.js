const express = require("express");
const WebSocket = require("ws");
const http = require("http");
require("dotenv").config({ quiet: true });
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3000;

let clientsNumbers = [];

app.use(express.static("public")); // Carrega os arquivos estáticos em 'public'

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});
app.get("/draw", (req, res) => {
    res.send(drawWinner());
});

server.listen(APP_PORT, () => {
    console.log(`App executando na porta ${APP_PORT}`);
});

let userCodes = new Map(); // token -> code

wss.on("connection", (ws, req) => {
    const query = req.url.split("?")[1];
    const params = new URLSearchParams(query);
    const token = params.get("token");

    if (token === process.env.ADMIN_TOKEN) {
        ws.isAdmin = true;
    } else {
        ws.isAdmin = false;
        let number = generateCode(ws, token, 100);
        ws.send(JSON.stringify({ type: "client-number", data: number }));
    }

    updateClientsCount();

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "draw-winner" && ws.isAdmin) {
            drawWinner();
        }
    });

    ws.on("close", () => {
        // remove só se não houver mais conexões com esse token
        if (![...wss.clients].some((c) => c.code === ws.code && c !== ws)) {
            clientsNumbers = clientsNumbers.filter((n) => n !== ws.code);
            userCodes.delete(token);
        }
        updateClientsCount();
    });
});

function generateCode(ws, token, size) {
    if (!userCodes.has(token)) {
        let randomNumber = Math.floor(Math.random() * size) + 1;
        userCodes.set(token, randomNumber);
        clientsNumbers.push(randomNumber);
    }
    ws.code = userCodes.get(token);
    return ws.code;
}

function drawWinner() {
    let randomNumber =
        clientsNumbers[Math.floor(Math.random() * clientsNumbers.length)];
    let winner = Array.from(wss.clients).find(
        (client) => client.code === randomNumber
    );

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if (client === winner || client.isAdmin) {
                client.send(
                    JSON.stringify({
                        type: "status-draw",
                        data: true,
                        winner: winner.code,
                    })
                );
            } else {
                client.send(
                    JSON.stringify({ type: "status-draw", data: false })
                );
            }
        }
    });
}

function updateClientsCount() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if (client.isAdmin === true) {
                client.send(
                    JSON.stringify({
                        type: "admin",
                        data: clientsNumbers.length,
                    })
                );
            }
        }
    });
}
