// bg is background and fg is foreground.

let bg = undefined
let bg_context = undefined
let fg = undefined
let fg_context = undefined

let canvas = undefined

class Arena {
    constructor() {
        this.color = '#fae3bf'
    }

    resize(width, height) {
        this.width = width
        this.height = height
    }

    draw() {
        bg_context.fillStyle = this.color
        bg_context.fillRect(0, 0, this.width, this.height)
    }
}



class Canvas {
    constructor() {
        this.arena = new Arena()
        // this.rockyTerrain = new RockyTerrain()
        // this.obstacles = undefined
        // this.destination = undefined
        // this.osv_frames = undefined
    }

    width() {
        return $('#fg').first().parent().width()
    }

    height() {
        return this.width() / 2
    }

    draw() {

        bg.width = this.width()
        bg.height = this.height()
        fg.width = this.width()
        fg.height = this.height()

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

function resize() {
    canvas.draw()
}

$(document).ready(() => {
    bg = document.getElementById('bg')
    bg_context = bg.getContext('2d')
    fg = document.getElementById('fg')
    fg_context = fg.getContext('2d')

    canvas = new Canvas()
    resize()
})

$(window).resize(resize)