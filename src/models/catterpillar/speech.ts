import Matter from "matter-js"
import SpeechBubble from "../speech-bubble"
import Catterpillar from "."

export type BodyPartOptions = {
    size: number,
    stiffness?: number,
    damping?: number,
    slop?: number,
    points?: number,
    restitution?: number,
}



class Speech {

    private catterPillar: Catterpillar
    private speechBubble: SpeechBubble | undefined
    private animatedText: string 
    private targetElement: HTMLElement
    private world: Matter.World
    
    
    #updateText(duration = 100, index = 0) {
        if (this.speechBubble) {
            this.speechBubble.text = this.animatedText.slice(0, index+1) + "..."
            if (index >= this.animatedText.length - 1) {
                this.speechBubble.text += "..."
                
                setTimeout(() => {
                    if (!this.speechBubble) { return }
                    this.speechBubble.text = this.animatedText.slice(0, index+1) + " .."
                    setTimeout(() => {
                        if (!this.speechBubble) { return }
                        this.speechBubble.text = this.animatedText.slice(0, index+1) + "  ."
                        setTimeout(() => {
                            if (!this.speechBubble) { return }
                            this.speechBubble.text = this.animatedText.slice(0, index+1)
                        }, duration *.6)
                    }, duration *.7)
                }, duration *.8)
            }
        }
        if (index < this.animatedText.length - 1) {
            setTimeout(() => {
                this.#updateText(duration, index+1)
            }, duration)
        }
    }
    

    #updateSpeechBubble() {
        if (this.speechBubble) {
            this.speechBubble.x = this.catterPillar.head.position.x + 4
            this.speechBubble.y = this.catterPillar.head.position.y - 24
            setTimeout(() => {
                this.#updateSpeechBubble()
            }, 200)
        }
    }

    constructor (
       catterPillar: Catterpillar,
       targetElement: HTMLElement,
       world: Matter.World
    ) {
        
        this.world = world
        this.targetElement = targetElement
        this.animatedText = ""
        this.catterPillar = catterPillar
    }

    remove() {
        this.speechBubble?.remove()
        this.animatedText = ""
        this.speechBubble = undefined
    }
    
    speak(text: string, autoRemove?:number) {
        this.speechBubble = new SpeechBubble(this.world, this.targetElement, {x: this.catterPillar.head.position.x + 4, y: this.catterPillar.head.position.y - 24, text: this.animatedText})
        Matter.Composite.add(this.world, [this.speechBubble.composite])
        this.animatedText = text
        if (!this.animatedText) {
            return
        }
        this.#updateText(50)
                
        // Remove speechBubble after 20 seconds
        if (autoRemove) {
            setTimeout(() => {
                this.remove()
            }, autoRemove * 1000 )
        }
        requestAnimationFrame(() => this.#updateSpeechBubble())
    }
}

export default Speech
