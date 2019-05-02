// P everywhere stands for Preview
// bg is background and fg is foreground.

let canvas = undefined

$(document).ready(() => {
    canvas = new Canvas(document.getElementById('fg'),
                        document.getElementById('bg'))
    canvas.resize()
    canvas.draw()
})


$(window).resize(() => {
    canvas.resize()
    canvas.draw()
})
