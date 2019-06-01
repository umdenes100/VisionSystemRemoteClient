const ARENA_X = 4
const ARENA_Y = 2

const ROCKY_TERRAIN_OFFSET = 0.6
const ROCKY_TERRAIN_X = 0.65

const OBSTACLE_X = 0.2
const OBSTACLE_Y = 0.5

const DESTINATION_RADIUS = 0.09

const OSV_WIDTH = 0.3
const OSV_HEIGHT = 0.3


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
        this.y = 0
        this.width = canvasWidth * (ROCKY_TERRAIN_X / ARENA_X)
        this.height = canvasHeight
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

        this.actualWidth = OSV_WIDTH
        this.actualHeight = OSV_HEIGHT

        if (actualTheta < 0) {
            this.actualTheta = Math.PI + actualTheta
        } else {
            this.actualTheta = actualTheta
        }

        this.color = 'black'
    }

    resize(canvasWidth, canvasHeight) {
        this.width = canvasWidth * (this.actualWidth / ARENA_X)
        this.height = canvasHeight * (this.actualHeight / ARENA_Y)

        this.x = canvasWidth * ((this.actualX - (this.actualWidth / 2)) / ARENA_X)
        this.y = canvasHeight * ((ARENA_Y - (this.actualY + (this.actualHeight / 2))) / ARENA_Y)
    }

    draw(context) {
        console.log(this.actualTheta)
        context.translate(this.x + this.width / 2, this.y + this.height / 2)
        context.rotate(-this.actualTheta)
        context.fillStyle = this.color
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
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
