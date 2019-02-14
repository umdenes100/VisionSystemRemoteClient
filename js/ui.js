function status(curr) {

    let stat = $('#status');

    switch (curr) {
        case 'OPEN':
            stat.css('color', 'limegreen');
            break;
        case 'CLOSED':
            stat.css('color', 'red');
            break;
        default:
            stat.css('color', 'yellow');
            break;
    }
}

function autoscroll() {
    if($("#autoscroll").is(":checked")) {
        let textarea = $("#comms");
        let bottom = textarea.prop('scrollHeight') - textarea.height();

        textarea.animate({
            scrollTop: bottom
        }, 0);
    }
}

$(document).ready(
    function () {
        $("#autoscroll").on("click", autoscroll);
    }
);