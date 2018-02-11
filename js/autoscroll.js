$(document).ready(
    function () {
        $("#autoscroll").on("click", function () {
            if($(this).is(":checked")) {
                let textarea = $("#comms");
                let bottom = textarea.prop('scrollHeight') - textarea.height();

                textarea.animate({
                    scrollTop: bottom
                }, 500);
            }
        })
    }
);