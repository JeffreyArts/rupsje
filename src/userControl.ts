import Catterpillar from "./models/catterpillar"
import SpeechBubble from "./models/speech-bubble"
import Matter from "matter-js"

class UserControls {
    public catterPillar: Catterpillar
    private speechBubble: SpeechBubble | undefined
    private mjs: {
        world: Matter.World;
        runner: Matter.Runner;
        engine: Matter.Engine;
    }
    private targetElement : HTMLElement
    private animatedText: string

    constructor (
       user: {catterpillar: Catterpillar},
       targetButtons: {
        left: HTMLElement | null,
        right: HTMLElement | null,
        message: HTMLElement | null,
       },
       mjs: {
            world: Matter.World;
            runner: Matter.Runner;
            engine: Matter.Engine;
        },
        targetElement: HTMLElement
    ) {
        
       this.catterPillar = user.catterpillar
        
       this.mjs = mjs
       this.targetElement = targetElement
       this.animatedText = ""

        if (targetButtons.left) {
            targetButtons.left.addEventListener("click", () => this.moveLeft())
        }
        if (targetButtons.right) {
            targetButtons.right.addEventListener("click", () => this.moveRight())
        }
        if (targetButtons.message) {
            targetButtons.message.addEventListener("submit", (e) => this.submitMessage(e))
        }
    }

    moveLeft() {
        if (this.catterPillar.isMoving) {
            return
        }
        this.catterPillar.move("left")
    }

    moveRight() {
        if (this.catterPillar.isMoving) {
            return
        }
        this.catterPillar.move("right")
    }

    _updateText(duration = 100, index = 0) {
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
                this._updateText(duration, index+1)
            }, duration)
        }
    }

    submitMessage(e:Event) {
        e.preventDefault()
        
        const formEl = e.target as HTMLFormElement
        if (!formEl) {
            throw new Error("Form element could not be found")
        }
        const inputEl = formEl.querySelector("input[type=text]") as HTMLInputElement
        
        if (!inputEl) {
            throw new Error("Can not find input element")
        }
        this.animatedText = inputEl.value
        if (!this.animatedText) {
            return
        }
        
        console.log(inputEl.value)
        console.log(this.catterPillar.head.position.x)
        this.speechBubble = new SpeechBubble(this.mjs.world, this.targetElement, {x: this.catterPillar.head.position.x + 4, y: this.catterPillar.head.position.y - 24, text: "Hello world"})
        Matter.Composite.add(this.mjs.world, [this.speechBubble.composite])
        this._updateText(50)
        inputEl.value = ""
        
        setTimeout(() => {
            this.speechBubble?.remove()
            this.speechBubble = undefined
        }, 20000 )
        requestAnimationFrame(() => this.updateSpeechBubble())
    }
    updateSpeechBubble() {
        if (this.speechBubble) {
            this.speechBubble.x = this.catterPillar.head.position.x + 4
            this.speechBubble.y = this.catterPillar.head.position.y - 24
            setTimeout(() => {
                this.updateSpeechBubble()
            }, 200)
        }
    }
}

export default UserControls

