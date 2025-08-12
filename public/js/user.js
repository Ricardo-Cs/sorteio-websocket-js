let socket = new WebSocket(WS_URL);

socket.addEventListener('message', handleServerMessage);

socket.addEventListener('error', error => {
    console.error('Erro no WebSocket:', error);
});

function handleServerMessage(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'clientNumber':
            console.log('Número do cliente: ' + message.data);
            break;
        case 'status-draw':
            let result;
            message.data ? result = 'Você Venceu!' : result = 'Você perdeu!';
            console.log('Resultado do sorteio: ' + result);
    }
}

function setClientState(state, ) {

}