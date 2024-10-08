let randomization = undefined  // Used to store the current randomization's data
let connection = undefined
let frames = undefined
let commands = undefined
let mapping = undefined
let timer = undefined
let obstaclesChecked = true
let lastObstacles = undefined  // Used to store obstacle data in case of toggligng.
let inProgress = false

const SERVER_URL = 'http://enes100-prod.engr-prod-keystone.aws.umd.edu:8888' // Production
// const SERVER_URL = 'http://enes100-dev.engr-prod-keystone.aws.umd.edu:8888' // Development

function requestRandomization() {
    let request = { type: 'randomization' }
    axios.get(SERVER_URL, request)
        .then(function(data){
            data = data.data
            let canvasses = [pcanvas]
            randomization = data
            canvasses.map(canv => {
                canv.osv = new OSV(data.osv.x, data.osv.y, data.osv.theta, mcanvas.osv.actualWidth / 1000, mcanvas.osv.actualHeight / 1000)
                canv.obstacles = data.obstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
                canv.destination = new Destination(data.destination.x, data.destination.y)
                if (obstaclesChecked === false){
                    canv.obstacles = [];
                }
                canv.draw()
            })
            lastObstacles = data.obstacles;  // Store obstacles for later toggling.
            // Handle case where calling randomization with obstacles button toggled off.
            if (obstaclesChecked === false) {
                data.obstacles = [];
            }
        })
        .catch(function (error) {
            if (String(error).startsWith('Axios')) {
                alert("You must load this site over http, not https. Please change the URL to start with http instead of https. Or, try the new simulator at https://umdenes100.github.io/enes100-simulator/")
            } else
                $('#terminal-output').text(error)
            console.log(error)
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
            if (sensor.selected) {
                return index
            }
        }).filter(element => {
            return element !== undefined
        })
    }

    axios.post(SERVER_URL, request)
            .then(function (data) {
                data = data.data
                inProgress = false
                document.getElementById('simulate').style.backgroundColor = ""  // Reset simulate button to default style.
                $('#terminal-output').text()
                $('#output').text(' ')
                $('#code').text(' ')
                lineIndexes = []

                if (data['error'] !== undefined) {
                    if (data['error'].startsWith('Axios')) {
                        alert("You must load this site over http, not https. Please change the URL to start with http instead of https. Or, try the new simulator at https://umdenes100.github.io/enes100-simulator/")
                    } else
                        $('#terminal-output').text(data['error'])  // Display error message on terminal.
                }
                else {
                    const today = new Date();
                    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const dateTime = date + ' ' + time;

                    code = editor.getDoc().getValue()
                    $('#code').text(code)

                    // We want to get the indexes of each line in the code.
                    lineIndexes.push(0)
                    let tackOn = 0;
                    const map = {
                        '&': '&amp;'.length - 1,
                        '<': '&lt;'.length - 1,
                        '>': '&gt;'.length - 1,
                    };

                    for (let i = 0; i < code.length; i++) {
                        if (map[code[i]] !== undefined) {
                            tackOn += map[code[i]]
                        } else if(code[i] === '\n') {
                            lineIndexes.push(i + tackOn + 1)
                        }
                    }

                    if (lineIndexes[lineIndexes.length - 1] !== code.length) {
                        lineIndexes.push(code.length)
                    }

                    lineIndexesAppended = []
                    for(let i = 0; i < lineIndexes.length; i++) {
                        lineIndexesAppended.push(lineIndexes[i])
                    }

                    $('#terminal-output').text('Simulation successful: ' + dateTime + '.')
                    // We want frames, commands, and a mapping from frames to last executed commands
                    frames = []
                    commands = []
                    mapping = []
                    currentCommands = []
                    currentFrame = 0
                    state = 'PAUSE'

                    for(let i = 0; i < data.length; i++) {
                        let element = data[i]
                        if (element.osv === undefined) {
                            // this is a command
                            commands.push(element)
                        } else {
                            // this is a frame
                            frames.push(element)
                            mapping.push(commands.length - 1)
                        }
                    }

                    clearInterval(timer)
                    canvas.osv = new OSV(r.osv.x, r.osv.y, r.osv.theta, r.osv.width, r.osv.height)
                    if (obstaclesChecked) {
                        canvas.obstacles = lastObstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
                    } else {  // Obstacles button not checked.
                        canvas.obstacles = [].map(obstacle => new Obstacle(obstacle.x, obstacle.y))
                    }
                    canvas.destination = new Destination(r.destination.x, r.destination.y)
                    canvas.draw()
                }
            })
            .catch(function (error) {
                $('#terminal-output').text(error)
                inProgress = false
                document.getElementById('simulate').style.backgroundColor = ""  // Reset simulate button to default style.
                $('#output').text(' ')
                $('#code').text(' ')
                lineIndexes = []
            })
}

$(document).ready(() => {
    requestRandomization()

    $('#randomize').on('click', requestRandomization)

    $('#simulate').on('click', () => {
        if (inProgress === false) {
            inProgress = true
            $('#terminal-output').text('Loading simulation...')
            document.getElementById('simulate').style.backgroundColor = 'grey'  // Grey out button when simulation is loading.
            requestSimulation()
        }
    })

    $('#obstacles').on('click', () => {
        if ($('#obstacles').is(":checked")) {
            obstaclesChecked = true
            pcanvas.obstacles = lastObstacles.map(obstacle => new Obstacle(obstacle.x, obstacle.y))
            randomization.obstacles = lastObstacles
            pcanvas.draw()
        } else {
            obstaclesChecked = false
            pcanvas.obstacles = []
            randomization.obstacles = []
            pcanvas.draw()
        }
    })
})


