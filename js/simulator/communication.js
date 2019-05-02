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

            randomization = message

            pcanvas.obstacles = message.obstacles.map(obstacle => new PObstacle(obstacle.x, obstacle.y))
            pcanvas.destination = new PDestination(message.destination.x, message.destination.y)
            pcanvas.draw()

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

})


