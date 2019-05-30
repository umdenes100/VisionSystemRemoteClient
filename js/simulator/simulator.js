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


let timer = undefined

$(document).ready(() => {
    $('#timestep').on('change', () => {
        console.log('Showing new frame')
        let frame = frames[parseInt($('#timestep').val())]
        console.log(frame)
        canvas.osv.actualX = frame.osv.x
        canvas.osv.actualY = frame.osv.y
        canvas.osv.actualTheta = frame.osv.theta
        canvas.resize()
        canvas.draw()
    })

    $('#play').on('click', () => {
        clearInterval(timer);

        let startTime = new Date().getTime()
        let actualFrames = frames.filter(frame => frame.osv !== undefined)

        timer = setInterval(simulate, 1)

        function simulate() {
            let frameIndex = Math.floor((new Date().getTime() - startTime) * 60 / 1000)
            if (frameIndex > actualFrames.length) {
                clearInterval(timer);
            }
            let frame = actualFrames[frameIndex]
            console.log(frame)

            canvas.osv.actualX = frame.osv.x
            canvas.osv.actualY = frame.osv.y
            canvas.osv.actualTheta = frame.osv.theta
            canvas.resize()
            canvas.draw()
        }
    })
})
