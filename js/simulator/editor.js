

$(document).ready(() => {
    let editor = CodeMirror(document.getElementById('editor'), {
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        mode: "text/x-c++src",
    })
})
