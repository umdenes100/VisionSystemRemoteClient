// P everywhere stands for Preview
// bg is background and fg is foreground.

let pcanvas = undefined

$(document).ready(() => {

    pcanvas = new Canvas(document.getElementById('pfg'), document.getElementById('pbg'))
    pcanvas.resize(['preview-wrapper'])
})

$(window).resize(() => pcanvas.resize())