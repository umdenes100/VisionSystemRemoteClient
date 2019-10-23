const ARENA_X = 4
const ARENA_Y = 2

const ROCKY_TERRAIN_OFFSET = 0.6
const ROCKY_TERRAIN_X = 0.65

const OBSTACLE_X = 0.2
const OBSTACLE_Y = 0.5

const DESTINATION_RADIUS = 0.09

const OSV_WIDTH = 0.3
const OSV_HEIGHT = 0.3

let arucoSim = new Image()
arucoSim.src = 'img/aruco.png'

class Arena {
    constructor() {
        this.color = '#fae3bf'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth
        this.height = canvasHeight
    }

    draw(context) {
        context.fillStyle = this.color
        context.fillRect(0, 0, this.width, this.height)
    }
}


class RockyTerrain {
    constructor() {
        this.color = '#dac2a1'
    }

    resize(canvasWidth, canvasHeight) {
        this.x = canvasWidth * (ROCKY_TERRAIN_OFFSET / ARENA_X)
        this.y = 1
        this.width = canvasWidth * (ROCKY_TERRAIN_X / ARENA_X)
        this.height = canvasHeight - 1
    }

    draw(context) {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}


class Obstacle {
    constructor(x, y) {
        this.actual_x = x
        this.actual_y = y

        this.color = '#a38966'
    }

    resize(canvasWidth, canvasHeight) {
        this.x = canvasWidth * (this.actual_x / ARENA_X)
        this.y = canvasHeight * ((2 - this.actual_y) / ARENA_Y)
        this.width = canvasWidth * (OBSTACLE_X / ARENA_X)
        this.height = canvasHeight * (OBSTACLE_Y / ARENA_Y)
    }

    draw(context) {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}


class Destination {
    constructor(x, y) {
        this.actual_x = x
        this.actual_y = y

        this.color = 'blue'
    }

    resize(canvasWidth, canvasHeight) {
        this.x = canvasWidth * (this.actual_x / ARENA_X)
        this.y = canvasHeight * ((ARENA_Y - this.actual_y) / ARENA_Y)
        this.radius = canvasWidth * (DESTINATION_RADIUS / ARENA_X)
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.strokeStyle = this.color
        context.stroke()
        context.closePath()
    }
}


class OSV {
    constructor(actualX, actualY, actualTheta, actualWidth, actualHeight) {
        this.actualX = actualX
        this.actualY = actualY
        this.actualWidth = actualWidth
        this.actualHeight = actualHeight
        this.actualTheta = actualTheta

        this.tread_color = '#5c5b5c'
        this.arrow_color = '#7fff00'
        this.color = '#000000'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth * (this.actualWidth / ARENA_X)
        this.height = canvasHeight * (this.actualHeight / ARENA_Y)

        this.x = canvasWidth * ((this.actualX - (this.actualWidth / 2)) / ARENA_X)
        this.y = canvasHeight * ((ARENA_Y - (this.actualY + (this.actualHeight / 2))) / ARENA_Y)
    }

    draw(context) {
        let offsetX = this.x + this.width / 2
        let offsetY = this.y + this.height / 2
        context.translate(offsetX, offsetY)
        context.rotate(-this.actualTheta)

        let treadWidth = 0.1 * this.height
        let treadSpace = 0.05 * this.height

        let osv_height = this.height - 2 * treadWidth - 2 * treadSpace
        let osv_width = this.width * 0.8

        context.fillStyle = this.color
        context.fillRect(this.x + this.width * 0.1 - offsetX, this.y + treadSpace + treadWidth - offsetY, osv_width, osv_height)

        context.fillStyle = this.tread_color
        context.fillRect(this.x - offsetX, this.y - offsetY, this.width, treadWidth)
        context.fillRect(this.x - offsetX, this.y + treadWidth + 2 * treadSpace + osv_height - offsetY, this.width, treadWidth)

        let imageDimension = Math.min(osv_width, osv_height) * 0.8
        let imageX = this.x + (this.width - imageDimension) / 2 - offsetX
        let imageY = this.y + (this.height - imageDimension) / 2 - offsetY

        context.drawImage(arucoSim, imageX, imageY, imageDimension, imageDimension)

        let fromx = imageX
        let fromy = imageY
        let tox = imageX + imageDimension
        let toy = imageY

        context.fillStyle = this.arrow_color
        // we also want to draw an arrow indicating direction
        let headlen = 10;   // length of head in pixels
        let angle = Math.atan2(toy - fromy, tox - fromx);

        context.beginPath();  // Open channel.
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI/6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        context.strokeStyle = this.arrow_color
        context.lineWidth = "3"  // How thick the arrow should be.
        context.stroke()
        context.closePath()

        context.translate(0, 0)
    }
}


class Canvas {
    constructor(foregroundCanvas, backgroundCanvas) {

        this.foregroundCanvas = foregroundCanvas
        this.foregroundContext = this.foregroundCanvas.getContext('2d')
        this.backgroundCanvas = backgroundCanvas
        this.backgroundContext = this.backgroundCanvas.getContext('2d')

        this.arena = new Arena()
        this.rockyTerrain = new RockyTerrain()
        this.obstacles = undefined
        this.destination = undefined
        this.osv = undefined
        // this.osv_frames = undefined
    }

    width() {
        return $(this.foregroundCanvas).first().parent().width()
    }

    height() {
        return this.width() / 2
    }

    resize(elements_to_resize) {

        if (elements_to_resize === undefined) {
            elements_to_resize = []
        }

        elements_to_resize.map(elementId => {
            document.getElementById(elementId)
                    .setAttribute('style',`height:${this.height()}px`)
        })
    }

    draw() {
        this.backgroundCanvas.width = this.width()
        this.backgroundCanvas.height = this.height()
        this.foregroundCanvas.width = this.width()
        this.foregroundCanvas.height = this.height()

        this.backgroundElements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw(this.backgroundContext)
            }
        })

        this.foregroundElements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw(this.foregroundContext)
            }
        })
    }

    foregroundElements() {
        return [this.rockyTerrain, this.obstacles, this.destination, this.osv].flat()
    }

    backgroundElements() {
        return [this.arena]
    }
}
