const ARENA_X = 4
const ARENA_Y = 2

const ROCKY_TERRAIN_OFFSET = 0.6
const ROCKY_TERRAIN_X = 0.65

const OBSTACLE_X = 0.2
const OBSTACLE_Y = 0.5

const DESTINATION_RADIUS = 0.09

class Arena {
    constructor() {
        this.color = '#fae3bf'
    }

    resize(width, height) {
        this.width = width
        this.height = height
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

    resize(width, height) {
        this.x = width * (ROCKY_TERRAIN_OFFSET / ARENA_X)
        this.y = 0
        this.width = width * (ROCKY_TERRAIN_X / ARENA_X)
        this.height = height
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

    resize(width, height) {
        this.x = width * (this.actual_x / ARENA_X)
        this.y = height * ((2 - this.actual_y) / ARENA_Y)
        this.width = width * (OBSTACLE_X / ARENA_X)
        this.height = height * (OBSTACLE_Y / ARENA_Y)
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

    resize(width, height) {
        this.x = width * (this.actual_x / ARENA_X)
        this.y = height * ((2 - this.actual_y) / ARENA_Y)
        this.radius = width * (DESTINATION_RADIUS / ARENA_X)
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.strokeStyle = this.color
        context.stroke()
        context.closePath()
    }
}

class Canvas {
    constructor(fg, bg) {

        this.fg = fg
        this.fg_context = this.fg.getContext('2d')
        this.bg = bg
        this.bg_context = this.bg.getContext('2d')

        this.arena = new Arena()
        this.rockyTerrain = new RockyTerrain()
        this.obstacles = undefined
        this.destination = undefined
        // this.osv_frames = undefined
    }

    width(element_id) {
        return $(this.fg).first().parent().width()
    }

    height() {
        return this.width() / 2
    }

    draw() {
        this.bg.width = this.width()
        this.bg.height = this.height()
        this.fg.width = this.width()
        this.fg.height = this.height()

        this.bg_elements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw(this.bg_context)
            }
        })

        this.fg_elements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw(this.fg_context)
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

    fg_elements() {
        return [this.rockyTerrain, this.obstacles, this.destination, this.osv].flat()
    }

    bg_elements() {
        return [this.arena]
    }
}
