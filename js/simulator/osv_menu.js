let mcanvas = undefined

const sensors = ([...Array(12).keys()]).map(no => {
    let side = undefined
    if ([0, 1, 2].includes(no)) {
        side = 'right'
    } else if ([3, 4, 5].includes(no)) {
        side = 'down'
    } else if ([6, 7, 8].includes(no)) {
        side = 'left'
    } else if ([9, 10, 11].includes(no)) {
        side = 'up'
    }
    let orientation = undefined
    if (side === 'right' || side === 'left') {
        orientation = 'vertical'
    } else if (side === 'up' || side === 'down') {
        orientation = 'horizontal'
    }

    return {
        no,
        orientation,
        side,
    }
})


class Sensor {
    constructor(number) {
        self.number = number
        self.vertical = false
        self.inverted = false
    }

    resize(canvasWidth, canvasHeight) {
        this.plate_width = (canvasWidth * 0.8) / 3
        this.plate_height = canvasHeight * 0.01

        this.cylinder_width = this.plate_width / 5
        this.cylinder_height = this.plate_width / 5


        this.x = 0
        this.y = canvasHeight * 0.05
    }

    draw(context) {

        if (self.vertical) {
            context.fillStyle = '#0a2869'
            context.fillRect(0, this.y, this.plate_height, this.plate_width)

            context.fillStyle = '#6d6d6d'
            context.fillRect(this.x + this.plate_height, this.y + this.plate_width / 5, this.cylinder_height, this.cylinder_width)
            context.fillRect(this.x + this.plate_height, this.y + this.plate_width * 3 / 5, this.cylinder_height, this.cylinder_width)
        } else {
            context.fillStyle = '#0a2869'
            context.fillRect(0, this.y, this.plate_width, this.plate_height)

            context.fillStyle = '#6d6d6d'
            context.fillRect(this.x + this.plate_width / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)
            context.fillRect(this.x + this.plate_width * 3 / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)
        }
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
        this.width = canvasWidth * this.actual_width / 800
        this.height = canvasHeight * this.actual_height / 800

        this.x = (canvasWidth - this.width) / 2
        this.y = (canvasHeight - this.height) / 2
    }

    draw(context) {

        context.fillStyle = this.tread_color
        context.fillRect(this.x - this.width * 0.1,
                         this.y - (this.height * 0.2),
                         this.width * 1.2,
                        this.height * 0.15)
        context.fillRect(this.x - this.width * 0.1,
                        this.y + this.height * 1.05,
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
        this.sensors = new Sensor(0)
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

        this.elements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw(this.context)
            }
        })
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

    elements() {
        return [this.osv, this.sensors].flat()
    }

}

$(document).ready(() => {

    mcanvas = new MenuCanvas(document.getElementById('osv-menu'))
    mcanvas.resize(['preview-row'])
    mcanvas.draw()

    $('#length').on('change', () => {
        mcanvas.osv.actualWidth = parseInt($('#length').val())
        mcanvas.draw()
    })
    $('#width').on('change', () => {
        mcanvas.osv.actualHeight = parseInt($('#width').val())
        mcanvas.draw()
    })
})

$(window).resize(() => {
    mcanvas.resize(['preview-row'])
    mcanvas.draw()
})