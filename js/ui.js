function status(curr) {

    let stat = $('#status');

    if (curr === 'OPEN') {
        stat.css('color', 'limegreen');
    }

    else if (curr === 'CLOSED') {
        stat.css('color', 'red');
    }

    else {
        stat.css('color', 'yellow');
    }
}

function autoscroll() {
    if($(this).is(":checked")) {
        let textarea = $("#comms");
        let bottom = textarea.prop('scrollHeight') - textarea.height();

        textarea.animate({
            scrollTop: bottom
        }, 200);
    }
}

$(document).ready(
    function () {
        $("#autoscroll").on("click", autoscroll);
        $("#comms").on('change', autoscroll);
    }
);