$(document).ready(
    function () {
        $("#autoscroll").on("click", function () {
            if($(this).is(":checked")) {
                const textarea = $("#comms");
                const bottom = textarea.prop('scrollHeight') - textarea.height();

                textarea.animate({
                    scrollTop: bottom
                }, 500);
            }
        })
    }
);