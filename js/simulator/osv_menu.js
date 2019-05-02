// m stands for menu
// bg is background and fg is foreground.

let osv_menu = undefined
let osv_menu_context = undefined

let mosv = undefined
let mcanvas = undefined

class MOSV {
    constructor() {
        this.color = '#000000'
    }

    resize(canvas_width, canvas_height) {

        let length = parseInt(document.getElementById('length').value)
        let breadth = parseInt(document.getElementById('breadth').value)
        Cookies.set('length', length, { expires: 30, path: '/simulatorweb' })
        Cookies.set('breadth', breadth, { expires: 30, path: '/simulatorweb' })

        $('#actual-length').text(length)
        $('#actual-breadth').text(breadth)

        this.width = (length / 300) * 0.75 * canvas_height
        this.height = (breadth / 300) * 0.75 * canvas_width
        this.x = (canvas_width - this.width) / 2
        this.y = (canvas_height - this.height) / 2
    }

    draw() {
        osv_menu_context.fillStyle = this.color
        osv_menu_context.fillRect(this.x, this.y, this.width, this.height)
    }
}

class MCanvas {
    constructor() {
        this.osv = new MOSV()
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
        return [this.osv].flat()
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

    $('#length').on('change', mresize)
    $('#breadth').on('change', mresize)
})

$(window).resize(mresize)