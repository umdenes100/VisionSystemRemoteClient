let messages = [];

function clear() {
    messages = [];
    $("#comms").val("");
}

function updateComms(completely) {

    let comm = $("#comms");

    if (completely) {

        let comms = "";

        for (let mess in messages) {
            let valid = (messages[mess]["M_TYPE"] === "COMMAND") || (messages[mess]["M_TYPE"] === "DEBUG" && $('#debug').is(':checked'));

            if (valid) {
                comms += messages[mess]["CONTENT"];
            }
        }

        comm.val(comms);

    } else {
        comm.val(comm.val() + messages[messages.length - 1]["CONTENT"]);
    }

    autoscroll();

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
            let mess = data["CONTENT"];

            messages.push(mess);
            updateComms(false);

            break;

        default:
            console.log("Error.");
    }
}

$(document).ready(

    function start () {

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

            clear();

            let val = $('#ports').val();
            if (val) {
                connection.send(val);
            }
        });

        $("#debug").on('change', () => { updateComms(true) });

        $("#clear").on('click', clear);

    }

);