import _ from "lodash"
import Matter from "matter-js"
import Catterpillar from "../models/catterpillar"

export type CatterpillarOptions = {
    length: number,
    maxVelocity: number,
    stiffness?: number, 
    damping?: number, 
    restitution?: number,
    bodyPart: CatterpillarBodyPartOptions
} & { [key: string]: number }

export type CatterpillarBodyPartOptions = {
    size: number,
    stiffness?: number,
    damping?: number,
    points?: number,
    restitution?: number,
}
const catterpillarService = {
    isOutsideCanvas: (catterPillar, targetEl: HTMLElement) => {
        // Reset catterpillar when it is off screen
        const head = catterPillar.head
        const butt = catterPillar.butt

        if ((head.position.x > targetEl.clientWidth && butt.position.x > targetEl.clientWidth) ||
        (head.position.x <= 0 && butt.position.x < 0) ||
        (head.position.y > targetEl.clientHeight + 100 && butt.position.y > targetEl.clientHeight + 100)
        ) {
            return true
        } 

        return false
    }
}

export default catterpillarService