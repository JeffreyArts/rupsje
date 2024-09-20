import Matter from "matter-js"

export default {
    init(domElement: HTMLElement) {
        // NOTE: domElement can't be a canvas element
        if (!domElement) {
            throw new Error("Dom element can not be found")
        }

        if (domElement.children.length > 0) {
            for (let i=0; i < domElement.children.length; i++) {
                domElement.children[i].remove()
            }
        }

        // create an engine
        const engine = Matter.Engine.create({
            enableSleeping: true,
            gravity: {
                x: 0,
                y: 1
            }
        })

        // create runner
        const render = Matter.Render.create({
            element: domElement,
            engine: engine,
            options: {
                width: domElement.clientWidth,
                height: domElement.clientHeight,
                showAngleIndicator: true,
                showVelocity: true,
            }
        })

        const runner = Matter.Runner.create()
        
        Matter.Render.run(render)

        // run the engine
        Matter.Runner.run(runner, engine)
        return {
            world: engine.world,
            runner: runner,
            engine: engine,
        }
    },
    destroy(runner: Matter.Runner, engine: Matter.Engine) {
        Matter.Runner.stop(runner)
        Matter.Engine.clear(engine)
    },
}