// let startMils = 0;
// let startSecs = 0;
// let startMins = 0;
//
// let currMils = 0;
// let currSecs = 0;
// let currMins = 0;
//
// let diffMils = 0;
// let diffSecs = 0;
// let diffMins = 0;
//
// let t;
//
// function updateTimer() {
//     t = setTimeout(addTime, 1);
// }
//
// function addTime () {
//
//     let d = new Date();
//
//     mils = d.getMilliseconds();
//     secs = d.getSeconds();
//     mins = d.getMinutes();
//
//     $("#timer").text(`${mins}:${secs}:${mils}`);
//
//     updateTimer();
// }
//
//
//
// function timerStart () {
//     $("#timer").text("00:00:00");
//     updateTimer();
// }
//
// function timerEnd () {
//     clearTimeout(t);
// }
//
// function timerSplit () {
//     $("#split").text($("#timer").text());
// }
//
// function timerReset() {
//     mils = 0;
//     secs = 0;
//     mins = 0;
//     $("#split").text("--:--:---");
//     updateTimer(t);
// }