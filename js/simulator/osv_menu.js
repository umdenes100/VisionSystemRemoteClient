// m stands for menu
// bg is background and fg is foreground.

let osv_menu = undefined
let osv_menu_context = undefined

let mcanvas = undefined

class MCanvas {
    constructor() {
        // this.arena = new Arena()
        // this.rockyTerrain = new RockyTerrain()
        // this.obstacles = undefined
        // this.destination = undefined
        // this.osv_frames = undefined
    }

    width() {
        return $('#osv-menu').first().parent().width()
    }

    height() {
        return this.width()
    }

    draw() {

        osv_menu.width = this.width()
        osv_menu.height = this.height()

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

function mresize() {
    mcanvas.draw()

    let pr = document.getElementById('preview-row')

    let height = undefined
    if (pcanvas !== undefined) {
        height = Math.max(pcanvas.height(), mcanvas.height())
    } else {
        height = mcanvas.height()
    }

    pr.setAttribute("style",`height:${height}px`)
}

$(document).ready(() => {
    osv_menu = document.getElementById('osv-menu')
    osv_menu_context = osv_menu.getContext('2d')

    mcanvas = new MCanvas()
    mresize()
})

$(window).resize(mresize)