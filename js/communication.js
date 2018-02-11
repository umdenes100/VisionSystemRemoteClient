$(document).ready(

    function () {
        let connection = new WebSocket('ws://echo.websocket.org/');

        connection.onopen = () => { connection.send('Ping'); };
        connection.onerror = error => { console.log('WebSocket Error: ' + error); };
        connection.onmessage = e => { console.log('Server: ' + e.data); };

    }

);