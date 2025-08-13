let socket = new WebSocket(WS_URL);
const numberSpan = document.getElementById("client-number");
const resultSpan = document.getElementById("client-state");

socket.addEventListener("message", handleServerMessage);

socket.addEventListener("error", (error) => {
    console.error("Erro no WebSocket:", error);
});

function handleServerMessage(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "client-number":
            numberSpan.innerText = `Número de sorteio: ${message.data}`;
            break;
        case "status-draw":
            if (message.data) {
                resultSpan.innerText = "Você Ganhou!";
            } else {
                resultSpan.innerText = "Você Perdeu!";
            }
    }
}

function setClientState(state) {}
