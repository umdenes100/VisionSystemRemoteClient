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

const ENUM2MISSIONCOMM = {
    0: "BASE",
    1: "BONUS",
    2: "END",
    3: "NAVIGATED",
    4: "START"
};

const MISSION2ICON = {
    "BLACK_BOX": '<i class="fas miss fa-cube"></i>',
    "CHEMICAL": '<i class="fas miss fa-flask"></i>',
    "DEBRIS": '<i class="fas miss fa-truck"></i>',
    "FIRE": '<i class="fas miss fa-fire"></i>',
    "WATER": '<i class="fas miss fa-tint"></i>',
    "": '<i></i>'
};


// TIMER STUFF START
//
// let timerTen = $("#timer-ten");
// let timerSec = $("#timer-sec");
//
// let splitTen = $("#split-ten");
// let splitSec = $("#split-sec");
//
// let Interval;
//
// let seconds = 0;
// let tens = 0;
//
// let splitted = false;
//
// function startTimer () {
//     tens++;
//
//     if(tens < 9){
//         timerTen.html("0" + tens);
//     }
//
//     if (tens > 9){
//         timerTen.html(tens);
//
//     }
//
//     if (tens > 99) {
//         seconds++;
//         timerSec.html("0" + seconds);
//         tens = 0;
//         timerTen.html("0" + 0);
//     }
//
//     if (seconds > 9){
//         timerSec.html(seconds);
//     }
// }
//
//
// function splitTimer () {
//     splitSec.html(timerTen.html());
//     splitTen.html(timerTen.html());
// }
//
// function runTimer(comm) {
//     switch(comm) {
//         case "START":
//             clearInterval(Interval);
//             Interval = setInterval(startTimer, 10);
//             break;
//
//         case "END":
//             clearInterval(Interval);
//             break;
//
//         case "SPLIT":
//             if (ENUM2MISSION[portList[$("#ports option:selected").val()]["MISSION"]] === "CHEMICAL" && !(splitted)) {
//                 splitTimer();
//                 splitted = true;
//             }
//             break;
//
//         default:
//             console.log("Timer screw up.")
//     }
// }

// TIMER STUFF END





function updateIcon() {
    let teamVal = $("#ports option:selected").val();

    for (let key in portList) {
        if (key === teamVal) {
            $("#mission_icon").html(MISSION2ICON[ENUM2MISSION[portList[key]["MISSION"]]]);
        }
    }
}

function clear() {
    messages = [];
    $("#comms").val("");

    // clearInterval(Interval);
    // tens = "00";
    // seconds = "00";
    // timerTen.html(tens);
    // timerSec.html(seconds);
    // splitted = false;
}


function parseMission(mess) {
    switch(ENUM2MISSIONCOMM[mess["CONTENT_TYPE"]]) {
        case "START":
            // runTimer("START");
            break;

        case "END":
            // runTimer("END");
            break;

        case "NAVIGATED":
            // runTimer("SPLIT");
            break;

        default:
            console.log("We good.");
    }
}


function updateComms(completely) {

    let comm = $("#comms");

    if (completely) {

        let comms = "";

        for (let mess in messages) {
            let valid = ($('#debug').is(':checked') || (messages[mess]["M_TYPE"] === "MISSION"));

            if (valid) {
                comms += messages[mess]["CONTENT"];
            }
        }

        comm.val(comms);

    } else {

        let valid = $('#debug').is(':checked') || (messages[messages.length - 1]["M_TYPE"] === "MISSION");

        if (messages[messages.length - 1]["M_TYPE"] === "MISSION") {
            parseMission(messages[messages.length - 1]);
        }

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