// P everywhere stands for Preview
// bg is background and fg is foreground.

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



class PCanvas {
    constructor() {
        this.arena = new PArena()
        // this.rockyTerrain = new RockyTerrain()
        // this.obstacles = undefined
        // this.destination = undefined
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
    document.getElementById('preview-row')
            .setAttribute("style",`height:${pcanvas.height()}px`);
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