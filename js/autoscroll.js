function autoscroll() {

	let $autoscroll = $('#autoscroll')

    if($autoscroll.is(":checked")) {
        let $textarea = $("#communication-window")
        let bottom = $textarea.prop('scrollHeight') - $textarea.height()
        console.log(bottom)

        $textarea.animate({
            scrollTop: bottom
        }, 0);
    }
}

$(document).ready(() => {
	$autoscroll.on('click', autoscroll)
})
