let randomization = undefined
let connection = undefined

const SERVER_URL = 'http://18.191.246.34:8888'

function request_randomization() {
    let request = { type: 'randomization' }
    $.get(SERVER_URL, request, data => {
        let canvasses = [pcanvas, canvas]

        canvasses.map(canv => {
            canv.obstacles = data.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
            canv.destination = new Destination(data.destination.x, data.destination.y)
            canv.draw()
        })
    })
}

$(document).ready(() => {

    request_randomization()

    $('#randomize').on('click', request_randomization)
    //
    // $('#simulate').on('click', () => {
    //     $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    // })

})


