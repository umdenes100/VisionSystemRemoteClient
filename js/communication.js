function status(stat) {
    if (stat === 'OPEN') {
        if ($('#status').css('color', 'red')) {
            $('#status').css('color', 'limegreen');
        }
    }

    else if ($('#status').css('color', 'limegreen')) {
        $('#status').css('color', 'red');
    }

    else {
        $('#status').css('color', 'yellow');
    }
}

$(document).ready(

    function start () {

        let servLoc = 'ws://localhost:8080';

        let connection = new WebSocket(servLoc);

        connection.onopen = () => {
            connection.send("Ping.");
            status('OPEN');
        };

        connection.onerror = error => {
            status('CLOSED');
            console.log('WebSocket Error: ' + error);
        };

        connection.onmessage = e => {
            console.log('Server: ' + e.data);
            status('OPEN');
            mess = e.data;

            $('#stream').attr('src', `data:image/jpeg;base64,${mess}`);
        };

        connection.onclose = () => {
            status('CLOSED');
            connection.send('Closed.');
            setTimeout(() => {
                console.log("Retrying...");
                start();
            }, 5000);
        };

    }

);

// $("#refresh").on('click', () => {
//
// });