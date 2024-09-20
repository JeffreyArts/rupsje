import Catterpillar from "./models/catterpillar"
import InitializeCanvas from "./services/initialize-canvas"
import UserControl from "./userControl"
import Matter from "matter-js"

type User = {
  catterPillar: Catterpillar
  active: boolean
}

const targetEl = document.getElementById("app")

if (!targetEl) {
  throw new Error("Invalid target")
}
const colors = ["#9ab44d", "#a4ca39", "#73c358", "#61b138", "#639263", "#8ba058", "#a2a738", "#708809", "#a5a855", "#93cb33", "#6c9565", "#1fc563", "#afb938"]
colors.push( ...["#eacab7", "#daaa8d", "#b78d74", "#a77151", "#c97258", "#c2c411", "#6957af", "#a93bb5", "#bbc291", "#fda22d"])
// const colors = ["#ef5b1b", "#ae5a27", "#e16843", "#f0cfa8", "#daaa8d", "#eedab7", "#cfaa3f", "#708809", "#45532c", "#39480c"]
const mjs = InitializeCanvas(targetEl)
const users = []
const mainScreen = location.search.includes("main") ? true : false
const catterpillarOptions = {
  color: colors[Math.floor(Math.random() * colors.length)],
  length: 14 + Math.floor(Math.random() * 8 - 4),
  maxVelocity:    3.2 + Math.random() * 1.6 - 0.8,
  stiffness:      .16 + Math.random() * 0.40 - 0.08, 
  restitution:    .72 + Math.random() * 0.16 - 0.08,
  bodyPart: {
      size:        10 + Math.floor(Math.random() * 10 - 5),
      stiffness:   .4 + Math.random() * .1,
      damping:    0,
      restitution: .5 + Math.random() * .6 - .3,
  },
}

users.push({
  catterpillar: new Catterpillar(mjs.world, {
    x: targetEl.clientWidth / 2,
    y: 8,
    autoBlink: true,
    ...catterpillarOptions
  })
})

if (mainScreen) {
  document.body.classList.add("__isMain")
} else {
  new UserControl(users[0], {
      left: document.getElementById("moveLeft"), 
      right: document.getElementById("moveRight"),
      message: document.getElementById("messageForm")
  },
  mjs,
  targetEl
)}

Matter.Composite.add(mjs.world, [
  users[0].catterpillar.composite
])
