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

wss.on("connection", (ws, req) => {
    const query = req.url.split("?")[1];
    const params = new URLSearchParams(query);
    const token = params.get("token");

    if (token) {
        if (token === process.env.ADMIN_TOKEN) {
            ws.isAdmin = true;
        } else {
            ws.close(1008, "Código de admin inválido");
            return;
        }
    } else {
        ws.isAdmin = false;
        let number = generateCode(ws, 100);
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
        clientsNumbers = clientsNumbers.filter((number) => number !== ws.code);
    });
});

function generateCode(ws, size) {
    let randomNumber = Math.floor(Math.random() * size) + 1;
    ws.code = randomNumber;
    clientsNumbers.push(randomNumber);
    return randomNumber;
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
