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

            let mess = data["CONTENT"];

            switch(mess["M_TYPE"]) {

                case "DEBUG":

                    let comm = $("#comms");

                    comm.val(comm.val() + mess["CONTENT"] + "\n");
                    break;

                case "COMMAND":
                    console.log("Command message");
                    break;

                default:
                    console.log("What is happening?");
            }

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
            console.log(data);
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
            let val = $('#ports').val();
            if (val) {
                connection.send(val);
            }
        });

    }

);