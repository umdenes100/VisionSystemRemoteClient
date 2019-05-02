let mcanvas = undefined

class MenuOSV {
    constructor(actual_width, actual_height) {
        this.actual_width = actual_width
        this.actual_height = actual_height

        this.color = '#000000'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth * this.actual_width / 500
        this.height = canvasHeight * this.actual_height / 500

        this.x = (canvasWidth - this.width) / 2
        this.y = (canvasHeight - this.height) / 2
    }

    draw(context) {
        console.log(context)
        console.log(this.x, this.y, this.width, this.height)
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class MenuCanvas {
    constructor(canvas) {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d')

        this.osv = new MenuOSV(225, 225)
    }

    width() {
        return $(this.canvas).first().parent().width()
    }

    height() {
        return this.width()
    }

    draw() {
        this.canvas.width = this.width()
        this.canvas.height = this.height()

        this.osv.resize(this.width(), this.height())
        this.osv.draw(this.context)
    }

    resize(elements_to_resize) {

        if (elements_to_resize === undefined) {
            elements_to_resize = []
        }

        this.draw()

        elements_to_resize.map(elementId => {
            document.getElementById(elementId)
                .setAttribute('style',`height:${this.height()}px`)
        })
    }

}

$(document).ready(() => {

    mcanvas = new MenuCanvas(document.getElementById('osv-menu'))
    mcanvas.resize(['preview-row'])
    mcanvas.draw()

    $('#length').on('change', () => {
        mcanvas.osv.actual_width = $('#length').val()
        mcanvas.draw()
    })
    $('#width').on('change', () => {
        mcanvas.osv.actual_height = $('#width').val()
        mcanvas.draw()
    })
})

$(window).resize(() => {
    mcanvas.resize(['preview-row'])
    mcanvas.draw()
})