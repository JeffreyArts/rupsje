import { Socket } from "socket.io-client"
import Catterpillar from "./models/catterpillar"
import Matter from "matter-js"

class UserControls {
    public catterPillar: Catterpillar
    private mjs: {
        world: Matter.World;
        runner: Matter.Runner;
        engine: Matter.Engine;
    }
    private targetElement : HTMLElement
    private socket: Socket
    private id: string
    
    constructor (
        user: {
            catterpillar: Catterpillar
            socket: Socket,
            id: string
        },
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
        this.socket = user.socket
        this.id = user.id
        this.mjs = mjs
        this.targetElement = targetElement
        
        
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

        this.socket.emit("move", {
            userId: this.id,
            value: "left"
        })

        this.catterPillar.move("left")
    }
    
    moveRight() {
        if (this.catterPillar.isMoving) {
            return
        }

        this.socket.emit("move", {
            userId: this.id,
            value: "right"
        })

        this.catterPillar.move("right")
    }

    submitMessage(e:Event) {
        e.preventDefault()
        
        const formEl = e.target as HTMLFormElement
        if (!formEl) {
            throw new Error("Form element could not be found")
        }
        const inputEl = formEl.querySelector("input[type=text]") as HTMLInputElement
        
        this.catterPillar.speak(inputEl.value, 24)

        this.socket.emit("speak", {
            userId: this.id,
            value: inputEl.value
        })
        
        inputEl.value = ""

        if (!inputEl) {
            throw new Error("Can not find input element")
        }
    }
}

export default UserControls

