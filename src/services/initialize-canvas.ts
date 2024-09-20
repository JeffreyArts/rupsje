import MatterService from "./../services/matter-js"
import Matter from "matter-js"
import paperService from "./../services/paper-js"

const initMatterJS = (domElement: HTMLElement) => {
    const canvasEl = domElement
    const mjs = MatterService.init(canvasEl)
    return mjs
}



const initPaperJS = (targetEl: HTMLElement) => {
    const parentElement = targetEl.parentElement
    if (!parentElement) {
      throw new Error("Missing parent element")
    }
    const canvas = parentElement.querySelector("#paperCanvas") as HTMLCanvasElement
  
    paperService.init(canvas, targetEl.clientWidth, targetEl.clientHeight)
}

const createGround = (targetEl:HTMLElement, world: Matter.World) => {
    if (!world) {
        throw new Error("world can't be null")
    }
  
    const ground = Matter.Bodies.rectangle(targetEl.clientWidth/2, targetEl.clientHeight+160, targetEl.clientWidth, 348, {
        isStatic: true,
        label: "ground",
        friction: 1,
        collisionFilter: {
            // category: 2,create
            // mask: 1
        }
    })
    
    // add all of the bodies to the world
    Matter.Composite.add(world, [ground])
}

const initializeCanvas = (targetEl: HTMLElement) => {

    const MatterJS = initMatterJS(targetEl)
    initPaperJS(targetEl)
    createGround(targetEl, MatterJS.world)
    // console.log(targetEl)
    // renderLoop(MatterJS)
    
    return MatterJS
}
export default initializeCanvas