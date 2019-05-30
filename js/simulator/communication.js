let randomization = undefined
let connection = undefined
let frames = undefined

const SERVER_URL = 'http://18.191.246.34:8888'

function requestRandomization() {
    let request = { type: 'randomization' }

    $.get(SERVER_URL, request, data => {
        let canvasses = [pcanvas, canvas]

        randomization = data
        console.log(randomization)
        canvasses.map(canv => {
            canv.osv = new OSV(data.osv.x, data.osv.y, data.osv.theta, mcanvas.osv.actual_width / 1000, mcanvas.osv.actual_height / 1000)
            canv.obstacles = data.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
            canv.destination = new Destination(data.destination.x, data.destination.y)
            canv.draw()
        })
    })
}

function requestSimulation() {

    let r = randomization
    r.osv.height = 0.3
    r.osv.width = 0.3


    let request = {
        type: 'simulation',
        code: editor.getDoc().getValue(),
        randomization: r,
        distance_sensors: [],
    }

    $.get(SERVER_URL, { 'json': JSON.stringify(request) }, data => {
        frames = data
    })


}

$(document).ready(() => {

    requestRandomization()

    $('#randomize').on('click', requestRandomization)
    $('#simulate').on('click', requestSimulation)

    // $('#simulate').on('click', () => {
    //     $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    // })

})


