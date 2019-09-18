const MISSION_TO_ICON = {
    'BLACK_BOX': 'ml-3 fa-cube',
    'DATA': 'ml-3 fa-laptop-code',
    'DEBRIS': 'ml-2 fa-truck',
    'FIRE': 'ml-3 fa-fire',
    'WATER': 'ml-3 fa-tint',
    '': ''
}

const MISSION_TO_ICON_COLOR = {
    'BLACK_BOX': 'black',
    'DATA': 'green',
    'DEBRIS': '#F0B823',
    'FIRE': '#F40D1A',
    'WATER': '#1b39e9',
    '': 'none'
}

function updateGlyphicon() {
	let $selected_port = $('#port option:selected')
	let mission = $selected_port.attr('class')

    let $mission_icon = $('#mission_icon i')

	$mission_icon.removeClass()
    $mission_icon.addClass(`mt-3 fas fa-lg miss ${MISSION_TO_ICON[mission]}`)
    $mission_icon.css('color', MISSION_TO_ICON_COLOR[mission])
}

$(document).ready(() => {
	setInterval(updateGlyphicon, 1)
})
