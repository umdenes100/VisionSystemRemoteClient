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
    if(localStorage.code) {
        starting_code = localStorage.code;
    } else {
        starting_code = '' +
            '#include "Enes100.h"\n' +
            '#include "Tank.h"\n' +
            '\n' +
            'void setup() {\n' +
            '\tEnes100.begin("Team Name Here", BLACK_BOX, 3, 8, 9);\n' +
            '\tTank.begin();\n' +
            '\tTank.setLeftMotorPWM(255);\n' +
            '\tTank.setRightMotorPWM(255);\n' +
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
        firstLineNumber: 3,

        lineNumbers: true,
        lineWrapping: true,

        matchBrackets: true,

        mode: 'text/x-c++src',
    })

    $('#save').on('click', () => {
        download(editor.getDoc().getValue(), 'enes100.ino')
    })
})

window.onbeforeunload = function (event) {
    event.preventDefault();
    localStorage.code = editor.getDoc().getValue();
    //localStorage.length =  $('#length').val();
    //localStorage.breadth = $('#breadth').val();
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
}

hotkeys('ctrl+s,cmd+s', function(event, handler) {
    event.preventDefault()
    download(editor.getDoc().getValue(), 'enes100.ino')
})