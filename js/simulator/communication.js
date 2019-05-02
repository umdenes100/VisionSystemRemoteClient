let randomization = undefined
let connection = undefined

$(document).ready(() => {

    connection = new WebSocket("ws://18.191.246.34:8888/")

    connection.onopen = () => {
        console.log('OPEN')
        connection.send(JSON.stringify({
            type: 'randomization'
        }))
    }

    connection.onerror = error => {
        console.log(`WebSocket Error.: ${error}`)
    }

    connection.onmessage = message => {

        message = JSON.parse(message.data)
        if (message.type === 'randomization') {

            let canvasses = [pcanvas, canvas]

            canvasses.map(canv => {
                canv.obstacles = message.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
                canv.destination = new Destination(message.destination.x, message.destination.y)
                canv.draw()
            })
        } else {
            console.log('Unimplemented')
        }
    }

    connection.onclose = () => {
        console.log('Failed')
    }

    $('#randomize').on('click', () => {
        connection.send(JSON.stringify({
            type: 'randomization'
        }))
    })

    $('#simulate').on('click', () => {
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    })

})


