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
    if(localStorage.code) {  // Saved code exists.
        starting_code = localStorage.code;  // Reload the saved code.
    } else {  // No code exists, so open the default.
        starting_code = '' +
            '#include "Enes100.h"\n' +
            '#include "Tank.h"\n' +
            '#include <math.h>\n' +
	    '\n' +
            'void setup() {\n' +
            '\tEnes100.begin("Team Name Here", CRASH_SITE, 3, 8, 9);\n' +
            '\tTank.begin();\n' +
	    '\tsetBothMotors(255);\n' +
            '}\n' +
            '\n' +
            'void loop() {\n' +
            '\tprintPi();\n' +
            '\twhile(1);  // Circumvent the loop and ensure the above statements only get run once.\n' +
            '}\n' +
            '\n' +
            '/* This is an example function to make both motors drive\n' +
            ' * at the given power.\n' +
            ' */\n' +
 	    'void setBothMotors(int speed) {\n' +
	    '\tTank.setLeftMotorPWM(speed);\n' +
            '\tTank.setRightMotorPWM(speed);\n' +
	    '}\n' +
            '\n' +
	    'void printPi() {\n' +
	    '\tEnes100.println(M_PI);  // M_PI is from the math.h library above.\n' +
	    '}\n' +
	    '\n'
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

// This function will auto-save the code before the page closes.
window.onbeforeunload = function (event) {
    // event.preventDefault();  // Prompt users before closing the page.
    localStorage.code = editor.getDoc().getValue();  // Store the current code.
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
    event.preventDefault()  // Prompt users before closing the page.
    download(editor.getDoc().getValue(), 'enes100.ino')  // Save code to an arduino file.
})
