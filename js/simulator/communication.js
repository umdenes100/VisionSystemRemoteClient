let randomization = undefined
let connection = undefined
let frames = undefined
let commands = undefined
let mapping = undefined

const SERVER_URL = 'http://18.191.246.34:8888'

function requestRandomization() {
    let request = { type: 'randomization' }

    $.get(SERVER_URL, request, data => {
        let canvasses = [pcanvas]

        randomization = data
        canvasses.map(canv => {
            canv.osv = new OSV(data.osv.x, data.osv.y, data.osv.theta, mcanvas.osv.actualWidth / 1000, mcanvas.osv.actualHeight / 1000)
            canv.obstacles = data.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
            canv.destination = new Destination(data.destination.x, data.destination.y)
            canv.draw()
        })
    })
}

function requestSimulation() {
    let r = randomization
    r.osv.height = mcanvas.osv.actualHeight / 1000
    r.osv.width = mcanvas.osv.actualWidth / 1000

    let request = {
        type: 'simulation',
        code: editor.getDoc().getValue(),
        randomization: r,
        distance_sensors: mcanvas.sensors.map((sensor, index) => {
            if(sensor.selected) {
                return index
            }
        }).filter(element => {
            return element !== undefined
        })
    }

    $.get(SERVER_URL, { 'json': JSON.stringify(request) }, data => {
        if(data['error'] !== undefined) {
            console.log(data['error'])
        } else {
            console.log('Compilation successful.')
            // we want frames, commands, and a mapping from frames to last executed commands
            frames = []
            commands = []
            mapping = []
            for(var i = 0; i < data.length; i++) {
                element = data[i]
                if(element.osv === undefined) {
                    // this is a command
                    commands.push(element)
                } else {
                    // this is a frame
                    frames.push(element)
                    mapping.push(commands.length - 1)
                }
            }

            console.log(commands)
            console.log(mapping)

            canvas.osv = new OSV(r.osv.x, r.osv.y, r.osv.theta, r.osv.width, r.osv.height)
            canvas.obstacles = r.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
            canvas.destination = new Destination(r.destination.x, r.destination.y)
            canvas.draw()
        } 
    })
    
}

$(document).ready(() => {
    requestRandomization()

    $('#randomize').on('click', requestRandomization)
    $('#simulate').on('click', requestSimulation)
})


