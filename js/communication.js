let messages = [];
let portList = {};
let previousPort = 'Select Team Here';

const servLoc = 'ws://192.168.1.2:9000/';
let connection;

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

    let clearVal = "--:--:--";
    $("#timer").text(clearVal);
    $("#split").text(clearVal);

    mils = 0;
    secs = 0;
    mins = 0;
}


function parseMission(mess) {

    console.log(mess);
    switch(ENUM2MISSIONCOMM[mess["CONTENT_TYPE"]]) {
        case "START":

            timerReset();

            timerStart();
            break;

        case "END":
            timerEnd();
            break;

        case "NAVIGATED":

            if (ENUM2MISSION[portList[$("#ports option:selected").val()]["MISSION"]] === "CHEMICAL") {
                timerSplit();
            }

            break;

        default:
            // console.log("");

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

        let isMission = (messages[messages.length - 1]["M_TYPE"] === "MISSION");
        if (isMission) {
            parseMission(messages[messages.length - 1]);
        }

        let valid = $('#debug').is(':checked') || isMission;
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
                value : "Select Team Here",
                text : "Select Team Here"
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
                ports.val("Select Team Here");
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

        connection = new WebSocket(servLoc);

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
            if (val === 'Select Team Here') {
                port_protocol = {
                    PORT: previousPort,
                    TYPE: "SOFT_CLOSE"
                }
            } else {

                if (previousPort === 'Select Team Here') {
                    port_protocol = {
                        PORT: val,
                        TYPE: "OPEN"
                    }
                } else {
                    port_protocol = {
                        PORT: previousPort,
                        TYPE: "SWITCH",
                        NEW_PORT: val
                    }
                }
            }

            previousPort = $('#ports').val();
            console.log(previousPort)
            connection.send(JSON.stringify(port_protocol))

            // timerReset();

            updateIcon();
        });

        $("#debug").on('click', () => { updateComms(true) });

        $("#clear").on('click', clear);

        $("#reset").on('click', () => {
            $("#stream").attr('src', 'http://192.168.1.2:8080/');
        })

        $('#expand').click(() => {
            document.location.href = '/fullscreen';
        })

        $('#collapse').click(() => {
            document.location.href = '/';
        })

        let timeout;
        $(document).mousemove(() => {

            let $element;

            clearInterval(timeout);
            if (window.location.pathname+window.location.search === '/fullscreen') {
                $element = $('#collapse')
            } else if (window.location.pathname+window.location.search === '/') {
                $element = $('#expand')
            }

            $element.show();
            $('#reset').show();
            setInterval(function(){
                $element.fadeOut();
                $('#reset').fadeOut();
            }, 5000);
        })
    }

);

$(window).on("unload", function(e) {
    port_protocol = {
        PORT: previousPort,
        TYPE: "HARD_CLOSE"
    }
    connection.send(JSON.stringify(port_protocol))
});