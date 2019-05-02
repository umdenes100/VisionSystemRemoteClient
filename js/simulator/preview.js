// P everywhere stands for Preview
// bg is background and fg is foreground.

const ARENA_X = 4
const ARENA_Y = 2

const ROCKY_TERRAIN_OFFSET = 0.6
const ROCKY_TERRAIN_X = 0.65

const OBSTACLE_X = 0.2
const OBSTACLE_Y = 0.5

const DESTINATION_RADIUS = 0.09

let pbg = undefined
let pbg_context = undefined
let pfg = undefined
let pfg_context = undefined

let pcanvas = undefined

class PArena {
    constructor() {
        this.color = '#fae3bf'
    }

    resize(width, height) {
        this.width = width
        this.height = height
    }

    draw() {
        pbg_context.fillStyle = this.color
        pbg_context.fillRect(0, 0, this.width, this.height)
    }
}

class PRockyTerrain {
    constructor() {
        this.color = '#dac2a1'
    }

    resize(width, height) {
        this.x = width * (ROCKY_TERRAIN_OFFSET / ARENA_X)
        this.y = 0
        this.width = width * (ROCKY_TERRAIN_X / ARENA_X)
        this.height = height
    }

    draw() {
        pfg_context.fillStyle = this.color
        pfg_context.fillRect(this.x, this.y, this.width, this.height)
    }
}


class PObstacle {
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

    draw() {
        pfg_context.fillStyle = this.color
        pfg_context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class PDestination {
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

    draw() {
        pfg_context.beginPath()
        pfg_context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        pfg_context.strokeStyle = this.color
        pfg_context.stroke()
        pfg_context.closePath()
    }
}

class PCanvas {
    constructor() {
        this.arena = new PArena()
        this.rockyTerrain = new PRockyTerrain()
        this.obstacles = undefined
        this.destination = undefined
        // this.osv_frames = undefined
    }

    width() {
        return $('#pfg').first().parent().width()
    }

    height() {
        return this.width() / 2
    }

    draw() {

        pbg.width = this.width()
        pbg.height = this.height()
        pfg.width = this.width()
        pfg.height = this.height()

        this.elements().map(element => {
            if (element !== undefined) {
                element.resize(this.width(), this.height())
                element.draw()
            }
        })
    }

    elements() {
        return [this.arena, this.rockyTerrain, this.obstacles, this.destination, this.osv].flat()
    }

}

function presize() {
    pcanvas.draw()

    let pw = document.getElementById('preview-wrapper')
    pw.setAttribute('style',`height:${pcanvas.height()}px`)

}

$(document).ready(() => {
    pbg = document.getElementById('pbg')
    pbg_context = pbg.getContext('2d')
    pfg = document.getElementById('pfg')
    pfg_context = pfg.getContext('2d')

    pcanvas = new PCanvas()
    presize()
})

$(window).resize(presize)