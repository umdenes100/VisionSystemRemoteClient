let messages = [];
let portList = {};

const ENUM2MISSION = {
    0: "BLACK_BOX",
    1: "CHEMICAL",
    2: "DEBRIS",
    3: "FIRE",
    4: "WATER",
    5: ""
};

const MISSION2ICON = {
    "BLACK_BOX": '<i class="fas miss fa-cube"></i>',
    "CHEMICAL": '<i class="fas miss fa-flask"></i>',
    "DEBRIS": '<i class="fas miss fa-truck"></i>',
    "FIRE": '<i class="fas miss fa-fire"></i>',
    "WATER": '<i class="fas miss fa-tint"></i>',
    "": '<i></i>'
};

function updateIcon() {
    let teamName = $("#ports option:selected").text();

    for (let key in portList) {
        if (portList[key]["NAME"] === teamName) {
            $("#mission_icon").html(MISSION2ICON[ENUM2MISSION[portList[key]["MISSION"]]]);
        }
    }
}

function clear() {
    messages = [];
    $("#comms").val("");
}

function updateComms(completely) {

    let comm = $("#comms");

    if (completely) {

        let comms = "";

        for (let mess in messages) {
            let valid = (messages[mess]["M_TYPE"] === "MISSION") || ($('#debug').is(':checked') && messages[mess]["M_TYPE"] === "DEBUG");

            if (valid) {
                comms += messages[mess]["CONTENT"];
            }
        }

        comm.val(comms);

    } else {

        let valid = (messages[messages.length - 1]["M_TYPE"] === "MISSION") || ($('#debug').is(':checked') && messages[messages.length - 1]["M_TYPE"] === "DEBUG");

        if (valid) {
            comm.val(comm.val() + messages[messages.length - 1]["CONTENT"]);
        }

    }

    autoscroll();

}

function parseData(data) {

    switch(data['TYPE']) {
        case "PORTLIST":

            portList = data["CONTENT"];

            ports = $("#ports");
            curr = ports.val();

            ports.empty();
            ports.append($("<option>", {
                value : "",
                text : ""
            }));

            for (let key in portList) {
                if (key !== portList[key]["NAME"]) {

                    ports.append($("<option>", {
                        value : key,
                        text : portList[key]["NAME"]
                    }));
                }
            }

            if (curr in portList) {
                ports.val(curr);
            } else {
                ports.val("");
            }

            updateIcon();

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
        // let servLoc = 'ws://localhost:9000';

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

            clear();

            let val = $('#ports').val();
            connection.send(val);

            updateIcon();
        });

        $("#debug").on('click', () => { updateComms(true) });

        $("#clear").on('click', clear);

    }

);