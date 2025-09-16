const numberSpan = document.getElementById("client-number");
const resultSpan = document.getElementById("client-state");

let token = localStorage.getItem("token");
if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("token", token);
}

// Inclui o token na conexão
const socket = new WebSocket(`${WS_URL}?token=${token}`);

socket.addEventListener("message", handleServerMessage);

socket.addEventListener("error", (error) => {
    console.error("Erro no WebSocket:", error);
});

function handleServerMessage(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "client-number":
            numberSpan.innerText = `${message.data}`;
            break;
        case "status-draw":
            if (message.data) {
                resultSpan.innerText = "Você Ganhou!";
            } else {
                resultSpan.innerText = "Você Perdeu!";
            }
            break;
    }
}
