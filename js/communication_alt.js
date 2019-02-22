const WEBSOCKET_ADDRESS = 'ws://192.168.1.2:9000/';
const connection = new WebSocket(WEBSOCKET_ADDRESS);

$(document).ready(() => {

    connection.onopen = () => {
        console.log('OPEN')
    };

    connection.onerror = error => {
        console.log('WebSocket Error.');
    };

    connection.onmessage = message => {
        console.log('OPEN')
        let data = JSON.parse(message.data);
        console.log(data);
        // connection.send("It's Lit")
    };

    connection.onclose = () => {
        console.log('CLOSE');
        connection.send('Closed.');
        setTimeout(() => {
            console.log("Retrying...");
            start();
        }, 5000);
    };
})