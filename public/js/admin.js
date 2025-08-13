const formAdmin = document.getElementById("confirmation-form");
const submitBtn = formAdmin.querySelector('input[type="submit"]');
const mainAdmin = document.querySelector(".main-admin");
const userCountSpan = document.getElementById("user-count");
const drawButton = document.getElementById("draw-button");
const winnerSpan = document.getElementById("winner-number");

formAdmin.addEventListener("submit", (e) => {
    e.preventDefault();

    // desabilita o botão para evitar múltiplos sockets
    submitBtn.disabled = true;

    const token = document.getElementById("admin-code").value;
    const socket = new WebSocket(`${WS_URL}/admin?token=${token}`);

    socket.addEventListener("open", () => {
        console.log("Conectado ao servidor WebSocket!");
        formAdmin.style.display = "none";
        mainAdmin.style.display = "flex";
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "admin") {
            userCountSpan.innerText = `Contagem de Usuários: ${message.data}`;
        } else if (message.type === "status-draw") {
            winnerSpan.innerText = `Vencedor: ${message.winner}`;
        }
    });

    socket.addEventListener("close", (event) => {
        console.log("Conexão fechada.");
        if (event.code === 1008) {
            alert("Código de admin inválido!");
        }
        submitBtn.disabled = false;
        formAdmin.style.display = "flex";
        mainAdmin.style.display = "none";
    });

    socket.addEventListener("error", (error) => {
        console.error("Erro no WebSocket:", error);
        submitBtn.disabled = false;
    });

    drawButton.addEventListener("click", () => {
        const message = {
            type: "draw-winner",
            data: true,
        };

        socket.send(JSON.stringify(message));
    });
});
