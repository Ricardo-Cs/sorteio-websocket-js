const token = '123456';
const socket = new WebSocket(`${WS_URL}?token=${token}`);

socket.addEventListener('open', () => {
    console.log('Conectado ao servidor WebSocket!');
});

socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'admin':
            console.log('Contagem de usuários: ' + message.data);
            break;
    }
});

socket.addEventListener('close', () => {
    console.log('Conexão fechada.');
});

socket.addEventListener('error', error => {
    console.error('Erro no WebSocket:', error);
});