const WEBSOCKET_ADDRESS = 'ws://192.168.1.2:9000/'
const connection = new WebSocket(WEBSOCKET_ADDRESS)

let selectedPort = ''

function changePort() {
    let newPort = $('#port').val()
    let portProtocol

    if (newPort === '') {
        portProtocol = {
            PORT: selectedPort,
            TYPE: 'SOFT_CLOSE'
        }
    } else {
        if (selectedPort === '') {
            portProtocol = {
                PORT: newPort,
                TYPE: 'OPEN'
            }
        } else {
            portProtocol = {
                PORT: selectedPort,
                TYPE: 'SWITCH',
                NEW_PORT: newPort
            }
        }
    }

    selectedPort = newPort

    connection.send(JSON.stringify(portProtocol))
}

$(window).on('unload', e => {
    let portProtocol = {
        PORT: selectedPort,
        TYPE: 'HARD_CLOSE'
    }
    connection.send(JSON.stringify(portProtocol))
})

$(document).ready(() => {

    $port = $("#port")

    connection.onopen = () => {
        console.log('OPEN')
    };

    connection.onerror = error => {
        console.log('WebSocket Error.')
    };

    connection.onmessage = message => {
        message = JSON.parse(message.data)
        let type = message['TYPE']
        let content = message['CONTENT']

        switch(type) {
            case 'PORT_LIST':
                $port.empty()
                $port.append($("<option>", {
                    value : '',
                    text : "Select Team Here..."
                }))

                Object.keys(content).map((port, index) => {
                    if (port !== content[port]['NAME']) {
                        $port.append($("<option>", {
                            value : port,
                            text : content[port]['NAME']
                        }))
                    }
                })

                if (Object.keys(content).includes(selectedPort))  {
                    $port.val(selectedPort)
                }
                break

            case 'DEBUG':
                $('#communication-window').append(content)
                autoscroll()
                break

            default:
                break
        }
        
    };

    connection.onclose = () => {
        console.log('CLOSE')
        connection.send('Closed.')
        setTimeout(() => {
            console.log("Retrying...")
            start()
        }, 5000)
    }

    $port.on('change', changePort)
})
