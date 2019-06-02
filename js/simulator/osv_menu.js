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

const PLATE_WIDTH = 0.125
const PLATE_HEIGHT = 0.005

class Sensor {
    constructor(number) {
        console.log('sensor #' + number + ' trial #4')
        this.number = number

        if (this.number / 3 < 1) {
            this.vertical = true
            this.inverted = false
            this.actual_x = 0.77
            if (this.number == 0) {
                this.actual_y = 0.26
            } else if (this.number == 1) {
                this.actual_y = 0.435
            } else {
                this.actual_y = 0.61
            }
        } else if (this.number / 3 < 2) {
            this.vertical = false
            this.inverted = false
            this.actual_y = 0.77
            if (this.number == 3) {
                this.actual_x = 0.61
            } else if (this.number == 4) {
                this.actual_x = 0.435
            } else {
                this.actual_x = 0.26
            }
        } else if (this.number / 3 < 3) {
            this.vertical = true
            this.inverted = true
            this.actual_x = 0.23
            if (this.number == 6) {
                this.actual_y = 0.61
            } else if (this.number == 7) {
                this.actual_y = 0.435
            } else {
                this.actual_y = 0.26
            }
        } else {
            this.vertical = false
            this.inverted = true
            this.actual_y = 0.23
            if (this.number == 9) {
                this.actual_x = 0.26
            } else if (this.number == 10) {
                this.actual_x = 0.435
            } else {
                this.actual_x = 0.61
            }
        }
    }

    resize(canvasWidth, canvasHeight) {
        this.plate_width = canvasWidth * PLATE_WIDTH
        this.plate_height = canvasHeight * PLATE_HEIGHT

        this.cylinder_width = this.plate_width / 5
        this.cylinder_height = this.plate_width / 5


        this.x = canvasWidth * this.actual_x
        this.y = canvasHeight * this.actual_y
    }

    draw(context) {
        if (this.vertical) {
            if (this.inverted) {
                context.fillStyle = '#0a2869'
                context.fillRect(this.x - this.plate_height, this.y, this.plate_height, this.plate_width)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x - this.plate_height, this.y + this.plate_width / 5, -this.cylinder_height, this.cylinder_width)
                context.fillRect(this.x - this.plate_height, this.y + this.plate_width * 3 / 5, -this.cylinder_height, this.cylinder_width)
            } else {
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y, this.plate_height, this.plate_width)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_height, this.y + this.plate_width / 5, this.cylinder_height, this.cylinder_width)
                context.fillRect(this.x + this.plate_height, this.y + this.plate_width * 3 / 5, this.cylinder_height, this.cylinder_width)
            }
        } else {
            if (this.inverted) {
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y - this.plate_height, this.plate_width, this.plate_height)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_width / 5, this.y - this.plate_height, this.cylinder_width, -this.cylinder_height)
                context.fillRect(this.x + this.plate_width * 3 / 5, this.y - this.plate_height, this.cylinder_width, -this.cylinder_height)
            } else {
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y, this.plate_width, this.plate_height)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_width / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)
                context.fillRect(this.x + this.plate_width * 3 / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)
            }
        }
    }
}

class MenuOSV {
    constructor(actualWidth, actualHeight) {
        this.actualWidth = actualWidth
        this.actualHeight = actualHeight

        this.tread_color = '#5c5b5c'
        this.color = '#000000'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth * this.actualWidth / 600
        this.height = canvasHeight * this.actualHeight / 600

        this.x = (canvasWidth - this.width) / 2
        this.y = (canvasHeight - this.height) / 2
    }

    draw(context) {
        // sum of 2 * tread + 2 * space + body = full height
        var treadWidth = 0.1 * this.height
        var treadSpace = 0.05 * this.height

        var osv_height = this.height - 2 * treadWidth - 2 * treadSpace
        var osv_width = this.width * 0.8

        context.fillStyle = this.color
        context.fillRect(this.x + this.width * 0.1, this.y + treadSpace + treadWidth, osv_width, osv_height)

        context.fillStyle = this.tread_color
        context.fillRect(this.x, this.y, this.width, treadWidth)
        context.fillRect(this.x, this.y + treadWidth + 2 * treadSpace + osv_height, this.width, treadWidth)

        let aruco = new Image()
        aruco.src = 'img/aruco.png'

        let imageDimension = Math.min(osv_width, osv_height) * 0.8
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
        this.sensors = []
        for(var i = 0; i < 12; i++) {
            this.sensors.push(new Sensor(i));
        }
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
        mcanvas.osv.actualHeight = parseInt($('#length').val())
        mcanvas.draw()
        canvas.draw()
    })

    $('#width').on('change', () => {
        mcanvas.osv.actualWidth = parseInt($('#width').val())
        mcanvas.draw()
        canvas.draw()
    })
})

$(window).resize(() => {
    mcanvas.resize(['preview-row'])
    mcanvas.draw()
})