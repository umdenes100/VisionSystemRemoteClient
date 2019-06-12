// P everywhere stands for Preview
// bg is background and fg is foreground.

let canvas = undefined
let currentCommands = []
let currentFrame = 0
let state = 'PAUSE'

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

function commandAt(frameNumber) {
    if(frameNumber === 0) {
        $('#panel').text("")
    } else {
        if(mapping[frameNumber] !== mapping[frameNumber - 1]) {
            // we have a new command
            command = commands[mapping[frameNumber]]

            if(command.command === 'print') {
                $('#panel').append(command.data)
            }

            if(currentCommands.length > 4) {
                currentCommands.shift()
            }

            currentCommands.push(command)
        }
    }
}

function commandsUntil(frameNumber) {
    for(var i = 0; i < frameNumber; i++) {
        commandAt(i)
    }
}

function simulation(startFrame) {
    // first we want to print everything to the screen until this point
    commandsUntil(startFrame)
    clearInterval(timer)
    let frameIndex = startFrame
    timer = setInterval(simulate, 16)   // 60 fps = 16 ms

    function simulate() {
        console.log(currentCommands)
        currentFrame = frameIndex
        $("#timestep").slider({
            value: currentFrame
        })

        if (frameIndex >= frames.length) {
            clearInterval(timer)
        }

        let frame = frames[frameIndex]
        canvas.osv.actualX = frame.osv.x
        canvas.osv.actualY = frame.osv.y
        canvas.osv.actualTheta = frame.osv.theta
        canvas.resize()
        canvas.draw()

        commandAt(frameIndex)
        frameIndex += 1
    }
}

$(document).ready(() => {
    $('#timestep').on('change', () => {
        let val = parseInt($('#timestep').val())
        currentFrame = val
        clearInterval(timer)
        state = 'PAUSE'
        commandsUntil(val)
        commandAt(val)

        let frame = frames[val]
        canvas.osv.actualX = frame.osv.x
        canvas.osv.actualY = frame.osv.y
        canvas.osv.actualTheta = frame.osv.theta
        canvas.resize()
        canvas.draw()
    })

    $('#play').on('click', () => {
        if(state === 'PAUSE') {
            simulation(currentFrame)
            state = 'PLAY'
        } else {
            clearInterval(timer)
            state = 'PAUSE'
        }
    })
})
