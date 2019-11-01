function openbugreport() {
    console.log("You clicked bug report fam");
}

$(document).ready(() => {
    console.log("Bug report script is starting.");
    $('#bugReport.nav-link').on('click', openbugreport);
})
