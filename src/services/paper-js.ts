import Paper from "paper"

export default {
    init(canvasEl: HTMLCanvasElement, width: number, height: number) {
        if (!canvasEl) {
            console.error("Can't find canvas")
            return
        }
        canvasEl.width = width
        canvasEl.height = height
        Paper.setup(canvasEl)

        if (Paper.view.viewSize.width != width) {
            Paper.view.viewSize.width = width
        }
        if (Paper.view.viewSize.height != height) {
            Paper.view.viewSize.height = height
        }
    },
    destroy() {
        while (Paper.projects.length > 0) {
            Paper.projects.pop()
        }
    },
}