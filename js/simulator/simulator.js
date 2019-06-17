// P everywhere stands for Preview
// bg is background and fg is foreground.

let canvas = undefined
let currentCommands = []
let currentFrame = 0
let state = 'PAUSE'
let lineIndexes = []
let lineIndexesAppended = []
let code = undefined

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

function clearFocus() {
    $('#code').text(code)
    lineIndexesAppended = []
    for(var i = 0; i < lineIndexes.length; i++) {
        lineIndexesAppended.push(lineIndexes[i])
    }
}

function focusLine(lineNumber) {
    if(lineIndexesAppended.length > 0 || lineNumber >= lineIndexesAppended.length) {
        // we want to add a <span> tag aroung the appropriate line of the text
        var text = document.getElementById("code")
        var innerHTML = text.innerHTML;
        innerHTML = innerHTML.substring(0, lineIndexesAppended[lineNumber]) + "<span class=\"focus\">" + innerHTML.substring(lineIndexesAppended[lineNumber], lineIndexesAppended[lineNumber + 1]) + "</span>" + innerHTML.substring(lineIndexesAppended[lineNumber + 1]);
        text.innerHTML = innerHTML;

        for(var i = lineNumber + 1; i < lineIndexesAppended.length; i++) {
            lineIndexesAppended[i] = lineIndexesAppended[i] + "<span class=\"focus\">".length + "</span>".length
        }
    }
}

function focusLines(lineNumbers) {
    clearFocus()
    for(var i = 0; i < lineNumbers.length; i++) {
        focusLine(lineNumbers[i])
    }
}

function commandAt(frameNumber) {
    if(frameNumber === 0) {
        $('#output').text("")
    } else {
        if(mapping[frameNumber] !== mapping[frameNumber - 1]) {
            // we have a new command
            command = commands[mapping[frameNumber]]

            if(command.command === 'print') {
                $('#output').append(command.data)
            }

            if(currentCommands.length > 4) {
                currentCommands.shift()
            }

            currentCommands.push(command)

            // now we need to focus the comands
            // first we need to get the lines
            focusLines(currentCommands.map(v => {
                return v.line_number
            }))
        }
    }
}

function commandsUntil(frameNumber) {
    currentCommands = []
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
        currentFrame = frameIndex
        document.getElementById("timestep").value = currentFrame.toString();

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
        if(frames !== undefined) {
            if(state === 'PAUSE') {
                simulation(currentFrame)
                state = 'PLAY'
                $('#control-button').text('pause')
            } else {
                clearInterval(timer)
                state = 'PAUSE'
                $('#control-button').text('play_arrow')
            }
        }
    })
})
