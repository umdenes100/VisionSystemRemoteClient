let randomization = undefined
let connection = undefined
let frames = undefined

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
        distance_sensors: [],
    }

    $.get(SERVER_URL, { 'json': JSON.stringify(request) }, data => {
        frames = data
        canvas.osv = new OSV(r.osv.x, r.osv.y, r.osv.theta, r.osv.width, r.osv.height)
        canvas.obstacles = r.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
        canvas.destination = new Destination(r.destination.x, r.destination.y)
        canvas.draw()
    })
    
}

$(document).ready(() => {
    requestRandomization()

    $('#randomize').on('click', requestRandomization)
    $('#simulate').on('click', requestSimulation)
})


