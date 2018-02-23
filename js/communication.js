function clear() {
    $("#comms").val("");
}

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

        $("#clear").on('click', clear);

        let servLoc = 'ws://192.168.1.2:9000/';

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