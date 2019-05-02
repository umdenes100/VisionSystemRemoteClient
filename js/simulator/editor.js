let editor = undefined

$(document).ready(() => {

    let starting_code = Cookies.get('code')
    if (starting_code === undefined) {
        starting_code = 'void setup() {\n\n}\n\nvoid loop() {\n\n}'
    }


    editor = CodeMirror(document.getElementById('editor'), {
        value: starting_code,

        indentUnit: 4,
        indentWithTabs: true,
        firstLineNumber: 0,

        lineNumbers: true,
        lineWrapping: true,

        matchBrackets: true,

        mode: "text/x-c++src",
    })
})

window.onbeforeunload = function (event) {
    Cookies.set('code', editor.getDoc().getValue(), { expires: 30, path: '/simulatorweb' })
}

hotkeys('ctrl+s,cmd+s', function(event, handler) {
    event.preventDefault()
    download(editor.getDoc().getValue(), 'enes100.ino')
})