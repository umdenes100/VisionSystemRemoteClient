let mcanvas = undefined

class Sensor {
    constructor() {

    }

    resize(canvasWidth, canvasHeight) {

    }

    draw(context) {

    }
}

class MenuOSV {
    constructor(actualWidth, actualHeight) {
        this.actual_width = actualWidth
        this.actual_height = actualHeight

        this.tread_color = '#5c5b5c'
        this.color = '#000000'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth * this.actual_width / 500
        this.height = canvasHeight * this.actual_height / 500

        this.x = (canvasWidth - this.width) / 2
        this.y = (canvasHeight - this.height) / 2
    }

    draw(context) {

        context.fillStyle = this.tread_color
        context.fillRect(this.x - this.width * 0.1,
                         this.y - (this.height * 0.15),
                         this.width * 1.2,
                        this.height * 0.15)
        context.fillRect(this.x - this.width * 0.1,
                        this.y + this.height,
                        this.width * 1.2,
                        this.height * 0.15)

        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)

        let aruco = new Image()
        aruco.src = 'img/aruco.png'

        let imageDimension = Math.min(this.width, this.height) * 0.8
        let imageX = this.x + (this.width - imageDimension) / 2
        let imageY = this.y + (this.height - imageDimension) / 2

        aruco.onload = () => {
            context.drawImage(aruco, imageX, imageY, imageDimension, imageDimension)
        }
    }
}

class MenuCanvas {
    constructor(canvas) {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d')

        this.osv = new MenuOSV(250, 200)
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
        mcanvas.osv.actual_width = parseInt($('#length').val())
        mcanvas.draw()
    })
    $('#width').on('change', () => {
        mcanvas.osv.actual_height = parseInt($('#width').val())
        mcanvas.draw()
    })
})

$(window).resize(() => {
    mcanvas.resize(['preview-row'])
    mcanvas.draw()
})