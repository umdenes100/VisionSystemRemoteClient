let mcanvas = undefined
const PLATE_WIDTH = 0.125
const PLATE_HEIGHT = 0.005

class Sensor {
    constructor(number) {
        this.number = number
        this.hover = false
        this.selected = false

        if (this.number / 3 < 1) { // 0, 1, 2 (right column)
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
        } else if (this.number / 3 < 2) { // 3, 4, 5 (bottom row)
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
        } else if (this.number / 3 < 3) { // 6, 7, 8 (left column)
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
        } else { // 9, 10, 11 (top row)
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

        if(this.vertical) {
            this.width = this.plate_height + this.cylinder_height
            this.height = this.plate_width
        } else {
            this.width = this.plate_width
            this.height = this.plate_height + this.cylinder_height
        }


        this.x = canvasWidth * this.actual_x
        this.y = canvasHeight * this.actual_y
    }

    getBox() { // Returns [{top left x, top left y},{bottom right x, bottom right y}] for a given sensor.
        if(!this.inverted) {
            return [{
                x: this.x,
                y: this.y
            }, {
                x: this.x + this.width,
                y: this.y + this.height
            }]
        } else {
            if(this.vertical) {
                return [{
                    x: this.x - this.width,
                    y: this.y
                }, {
                    x: this.x,
                    y: this.y + this.height
                }]
            } else {
                return [{
                    x: this.x,
                    y: this.y - this.height
                }, {
                    x: this.x + this.width,
                    y: this.y
                }]
            }
        }
    }

    draw(context) {
        if(!this.selected) {
            context.globalAlpha = 0.1
        }
        
        if(this.hover) {
            context.globalAlpha = 0.5
        }
        
        if (this.vertical) {
            if (this.inverted) { // 6, 7, 8
                context.fillStyle = '#0a2869'
                context.fillRect(this.x - this.plate_height, this.y, this.plate_height, this.plate_width)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x - this.plate_height, this.y + this.plate_width / 5, -this.cylinder_height, this.cylinder_width)
                context.fillRect(this.x - this.plate_height, this.y + this.plate_width * 3 / 5, -this.cylinder_height, this.cylinder_width)

                context.fillStyle = '#9d9d9d'
                context.font = '10px Arial'
                context.fillText(this.number.toString(), this.x - this.width*2, this.y + this.height/2)
            } else { // 0, 1, 2
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y, this.plate_height, this.plate_width)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_height, this.y + this.plate_width / 5, this.cylinder_height, this.cylinder_width)
                context.fillRect(this.x + this.plate_height, this.y + this.plate_width * 3 / 5, this.cylinder_height, this.cylinder_width)

                context.fillStyle = '#9d9d9d'
                context.font = '10px Arial'
                context.fillText(this.number.toString(), this.x + this.width*2, this.y + this.height/2)
            }
        } else {
            if (this.inverted) { // 9, 10, 11
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y - this.plate_height, this.plate_width, this.plate_height)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_width / 5, this.y - this.plate_height, this.cylinder_width, -this.cylinder_height)
                context.fillRect(this.x + this.plate_width * 3 / 5, this.y - this.plate_height, this.cylinder_width, -this.cylinder_height)

                context.fillStyle = '#9d9d9d'
                context.font = '10px Arial'
                context.fillText(this.number.toString(), this.x + this.width/2, this.y - this.height*2)
            } else { // 3, 4, 5
                context.fillStyle = '#0a2869'
                context.fillRect(this.x, this.y, this.plate_width, this.plate_height)
    
                context.fillStyle = '#6d6d6d'
                context.fillRect(this.x + this.plate_width / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)
                context.fillRect(this.x + this.plate_width * 3 / 5, this.y + this.plate_height, this.cylinder_width, this.cylinder_height)

                context.fillStyle = '#9d9d9d'
                context.font = '10px Arial'
                context.fillText(this.number.toString(), this.x + this.width/2, this.y + this.height*2)
            }
        }

        context.globalAlpha = 1
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

//Get Mouse Position
function getMousePos(canv, evt) {
    var rect = canv.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).ready(() => {
    mcanvas = new MenuCanvas(document.getElementById('osv-menu'))
    mcanvas.resize(['preview-row'])
    mcanvas.draw()

    document.getElementById("osv-menu").addEventListener("mousemove", function(evt) {
        var mousePos = getMousePos(document.getElementById("osv-menu"), evt)
        var cntx = document.getElementById("osv-menu").getContext("2d")
        mcanvas.sensors.forEach(element => {
            var box = element.getBox() 
            if(mousePos.x >= box[0].x && mousePos.x <= box[1].x && mousePos.y >= box[0].y && mousePos.y <= box[1].y) {
                element.hover = true
            } else {
                element.hover = false
            }
            cntx.clearRect(box[0].x - 1, box[0].y - 1, box[1].x - box[0].x + 2, box[1].y - box[0].y + 2)
            element.draw(cntx)
        })

    }, false)

    document.getElementById("osv-menu").addEventListener("click", function(evt) {
        var mousePos = getMousePos(document.getElementById("osv-menu"), evt)
        var cntx = document.getElementById("osv-menu").getContext("2d")
        mcanvas.sensors.forEach(element => {
            var box = element.getBox()
            if(mousePos.x >= box[0].x && mousePos.x <= box[1].x && mousePos.y >= box[0].y && mousePos.y <= box[1].y) {
                element.selected = !element.selected
            }

            cntx.clearRect(box[0].x - 1, box[0].y - 1, box[1].x - box[0].x + 2, box[1].y - box[0].y + 2)
            element.draw(cntx)
        })

    }, false)

    $('#length').on('change', () => {
        mcanvas.osv.actualHeight = parseInt($('#length').val())
        mcanvas.draw()

        // want to update the preview
        pcanvas.osv.actualHeight = mcanvas.osv.actualHeight / 1000
        pcanvas.draw()
    })

    $('#width').on('change', () => {
        mcanvas.osv.actualWidth = parseInt($('#width').val())
        mcanvas.draw()
        pcanvas.osv.actualWidth = mcanvas.osv.actualWidth / 1000
        pcanvas.draw()
    })
})

$(window).resize(() => {
    mcanvas.resize(['preview-row'])
    mcanvas.draw()
})
