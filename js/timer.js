const timeEl = $("#timer");
const splitEl = $("#split");

let mils = 0;
let secs = 0;
let mins = 0;

let t;

function timer () {
    t = setTimeout(addTime, 1);
}

function addTime () {
    mils++;
    if (mils >= 60) {
        mils = 0;
        secs++;

        if (secs >= 60) {
            secs = 0;
            mins++;
        }
    }

    timeEl.text((mins ? (mins > 9 ? mins : "0" + mins) : "00") + ":" + (secs ? (secs > 9 ? secs : "0" + secs) : "00") + ":" + (mils > 9 ? mils : "0" + mils));

    timer();
}

function start () {
    timeEl.text("00:00:00");
    timer();
}

function end () {
    clearTimeout(t);
}

function split () {
    splitEl.text(timeEl.text());
}