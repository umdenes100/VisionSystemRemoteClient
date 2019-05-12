let editor = undefined

$(document).ready(() => {

    // console.log(Cookies.get())

    // let length = Cookies.get('length')
    // if (length === undefined) {
    //     length = 200
    // }
    // $('#length').val(parseInt(length))
    //
    // let breadth = Cookies.get('breadth')
    // if (breadth === undefined) {
    //     breadth = 200
    // }
    // $('#breadth').val(parseInt(breadth))
    //
    // let starting_code = Cookies.get('code')
    let starting_code = undefined
    if (starting_code === undefined) {
        starting_code = '' +
            '#include "Enes100.h"\n' +
            '#include "Tank.h"\n' +
            '\n' +
            'Tank tank;\n' +
            '\n' +
            'void setup() {\n' +
            '\ttank.begin();\n' +
            '\ttank.setLeftMotorPWM(6, 255);\n' +
            '\ttank.setRightMotorPWM(7, 255);\n' +
            '}\n' +
            '\n' +
            'void loop() {\n' +
            '\n' +
            '}\n'
    }

    // mresize()

    editor = CodeMirror(document.getElementById('editor'), {
        value: starting_code,

        indentUnit: 4,
        indentWithTabs: true,
        firstLineNumber: 0,

        lineNumbers: true,
        lineWrapping: true,

        matchBrackets: true,

        mode: 'text/x-c++src',
    })

    $('#save').on('click', () => {
        download(editor.getDoc().getValue(), 'enes100.ino')
    })
})

// window.onbeforeunload = function (event) {
//
//     // Cookies.remove('length')
//     // Cookies.remove('breadth')
//     // Cookies.remove('code')
//
//     console.log('here')
//     console.log(Cookies.get())
//     console.log($('#length').val())
//     event.preventDefault()
//     Cookies.set('length', $('#length').val(), { expires: 30, path: '/simulatorweb' })
//     Cookies.set('breadth', $('#breadth').val(), { expires: 30, path: '/simulatorweb' })
//     Cookies.set('code', editor.getDoc().getValue(), { expires: 30, path: '/simulatorweb' })
//     console.log(Cookies.get())
//     // while (true) {
//     //
//     // }
//     event.preventDefault()
// }

hotkeys('ctrl+s,cmd+s', function(event, handler) {
    event.preventDefault()
    download(editor.getDoc().getValue(), 'enes100.ino')
})
