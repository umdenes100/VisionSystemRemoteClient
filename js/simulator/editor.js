let editor = undefined
const example_code = '' +
    '#include "Enes100.h"\n' +
    '#include "Tank.h"\n' +
    '#include <math.h>\n' +
    '\n' +
    '/* The code inside void setup() runs only once, before the code in void loop(). */\n' +
    'void setup() {\n' +
        '\tEnes100.begin("Team Name Here", CRASH_SITE, 3, 8, 9); // Required before you can use any other Enes100 functions.\n' +
        '\tTank.begin(); // Required before you can use any other Tank functions.\n' +
        '\tsetBothMotors(255); // Set both motors to full power.\n' +
    '}\n' +
    '\n' +
    '/* The code in void loop() runs repeatedly forever */ \n' +
    'void loop() { \n' +
        '\tprintPi();\n' +
        '\tEnes100.updateLocation(); // Update ``Enes100.location``.\n' +
        '\tEnes100.println(Enes100.location.y); // Print the OSV`s y coordinate at the time ``Enes100.updateLocation()`` was called.\n' +
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
    '/* Another example function that prints pi. */\n' +
    'void printPi() {\n' +
        '\tEnes100.println(M_PI);  // M_PI is from the math.h library above.\n' +
    '}\n' +
    '\n'

$(document).ready(() => {
    if(localStorage.code) {  // Saved code exists.
        starting_code = localStorage.code;  // Reload the saved code.
    } else {  // No code exists, so open the default.
        starting_code = example_code;
    }

    editor = CodeMirror(document.getElementById('editor'), {
        value: starting_code,

        indentUnit: 4,
        indentWithTabs: true,
        firstLineNumber: 1,

        lineNumbers: true,
        lineWrapping: true,

        matchBrackets: true,

        mode: 'text/x-c++src',
    })
    if(localStorage.dark == "true") { // User had previously set theme to dark.
        document.getElementById("dark-theme").checked = true
        changeTheme()
    }

    $('#save').on('click', () => {
        if(localStorage.version){
            localStorage.version = parseInt(localStorage.version) + 1
        } else {
            localStorage.version = 1
        }
        var fileName = 'simulator-code-v' + localStorage.version + '.ino'
        download(editor.getDoc().getValue(), fileName)
    })

    $('#example-code').on('click', () => {
        if(confirm("This will overwrite whatever code you currently have! Make sure you have everything you need saved before proceeding.")) {
            editor.setValue(example_code)
        } else {}
    })
})

// This function will auto-save the code before the page closes.
window.onbeforeunload = function (event) {
    // event.preventDefault();  // Prompt users before closing the page.
    localStorage.code = editor.getDoc().getValue();  // Store the current code.
    //localStorage.length =  $('#length').val();
    //localStorage.breadth = $('#breadth').val();
}

hotkeys('ctrl+s,cmd+s', function(event, handler) {
    event.preventDefault()  // Prompt users before closing the page.
    download(editor.getDoc().getValue(), 'enes100.ino')  // Save code to an arduino file.
})

function changeTheme() {
    var dark = document.getElementById("dark-theme");
    if (dark.checked == true) {
        localStorage.dark = "true";
        editor.setOption("theme", "ambiance")
        document.documentElement.style.setProperty("--background","#202020")
        document.documentElement.style.setProperty("--border","#000000")
        document.documentElement.style.setProperty("--border-top","#000000")
        document.documentElement.style.setProperty("--color","#f5f5f5")
        document.documentElement.style.setProperty("--focus","#999900")
        document.documentElement.style.setProperty("--scrollbar","#505050")
        
    } else {
        localStorage.dark = "false";
        editor.setOption("theme","default")
        document.documentElement.style.setProperty("--background","#f5f5f5")
        document.documentElement.style.setProperty("--border","#c0c0c0")
        document.documentElement.style.setProperty("--border-top","#ffffff")
        document.documentElement.style.setProperty("--color","#000000")
        document.documentElement.style.setProperty("--focus","#ffff00")
        document.documentElement.style.setProperty("--scrollbar","#a0a0a0")
    }
}
