import _ from "lodash"
import Catterpillar from "../models/catterpillar"

const catterpillarService = {
    isOutsideCanvas: (catterPillar: Catterpillar, targetEl: HTMLElement) => {
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