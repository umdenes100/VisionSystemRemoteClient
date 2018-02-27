function requestMessages(connection, port) {
    connection.send(port);
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

$(document).ready(

    function start () {

        $("#clear").on('click', clear);

        let servLoc = 'ws://192.168.1.2:9000/';

        let connection = new WebSocket(servLoc);

        connection.onopen = () => {
            status('OPEN');
        };

        connection.onerror = error => {
            status('CLOSED');
            console.log('WebSocket Error.');
        };

        connection.onmessage = message => {
            status('OPEN');
            let data = JSON.parse(message.data);
            parseData(data);

        };

        connection.onclose = () => {
            status('CLOSED');
            connection.send('Closed.');
            setTimeout(() => {
                console.log("Retrying...");
                start();
            }, 5000);
        };

        $('#ports').on('change', () => {
            let val = $(this).val();

            if (val) {
                requestMessages(connection, val);
            }
        });

    }

);