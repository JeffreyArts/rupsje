import CatterpillarService from "./../services/catterpillar"
import MatterService from "./../services/matter-js"
import Matter from "matter-js"
import paperService from "./../services/paper-js"
// import { MouthState } from "./../models/catterpillar/mouth"


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

const createGround = (targetEl:HTMLElement, mjs) => {
    if (!mjs.world) {
        throw new Error("mWorld can't be null")
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
    Matter.Composite.add(mjs.world, [ground])
}

const renderLoop = (mjs) => {
    // Exit renderLoop when component has been unmounted
    
    if (!mjs.world) {
        return
    }
    
    requestAnimationFrame(() => {renderLoop(mjs)})
    
    
      console.log("A")
      return
      if (CatterpillarService.isOutsideCanvas(Catterpillar, targetEl)) {
  
        // this.removeCatterpillar()
        
        // // Don't create new catterpillar immediately for UX reasons
        // setTimeout(() => {
        //   this.generateCatterpillar()
        // }, 480)
      // } 
    }
  
    // if (this.mouseDown && this.mouseTarget) {
    //     Matter.Body.setVelocity( this.mouseTarget, {
    //         x: this.mousePos.x - this.mouseTarget.position.x,
    //         y: this.mousePos.y - this.mouseTarget.position.y,
    //     })
    // }
    
    // requestAnimationFrame(renderLoop)
  }

const initializeCanvas = (targetEl: HTMLElement) => {

    const MatterJS = initMatterJS(targetEl)
    initPaperJS(targetEl)
    createGround(targetEl, MatterJS)
    // console.log(targetEl)
    renderLoop(MatterJS)
    
    return MatterJS
}
export default initializeCanvas