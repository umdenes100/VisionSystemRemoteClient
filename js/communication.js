function requestMessages() {

}

function parseData(data) {

    switch(data['TYPE']) {
        case "PORTLIST":

            list = data["CONTENT"];

            ports = $("#ports");
            curr = ports.val();

            ports.empty();
            ports.append($("<option>", {
                value : "",
                text : ""
            }));

            for (let key in list) {
                if (key !== list[key]) {
                    ports.append($("<option>", {
                        value : key,
                        text : list[key]
                    }));
                }
            }

            if (curr in list) {
                ports.val(curr);
            } else {
                ports.val("");
            }

            break;


        case "MESSAGE":
            break;

        default:
            console.log("Error.");
    }
}

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
            // connection.send();
            status('OPEN');
        };

        connection.onerror = error => {
            status('CLOSED');
            console.log('WebSocket Error: ' + error);
        };

        connection.onmessage = e => {
            // console.log('Server: ' + e.data);

            status('OPEN');

            let data = JSON.parse(e.data);

            // console.log(data);
            connection.send("ttyUSB0");
            // parseData(data);

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