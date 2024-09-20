import Catterpillar from "./models/catterpillar"
import InitializeCanvas from "./services/initialize-canvas"
import catterpillarService from "./services/catterpillar"
import UserControl from "./userControl"
import Matter from "matter-js"
import { io } from "socket.io-client";
import hash from "object-hash"
import _ from "lodash"

type User = {
  catterpillar: Catterpillar
  id: string
}

const targetEl = document.getElementById("app")

if (!targetEl) {
  throw new Error("Invalid target")
}
const colors = ["#9ab44d", "#a4ca39", "#73c358", "#61b138", "#639263", "#8ba058", "#a2a738", "#708809", "#a5a855", "#93cb33", "#6c9565", "#1fc563", "#afb938"]
colors.push( ...["#eacab7", "#daaa8d", "#b78d74", "#a77151", "#c97258", "#c2c411", "#6957af", "#a93bb5", "#bbc291", "#fda22d"])
// const colors = ["#ef5b1b", "#ae5a27", "#e16843", "#f0cfa8", "#daaa8d", "#eedab7", "#cfaa3f", "#708809", "#45532c", "#39480c"]
const mjs = InitializeCanvas(targetEl)
const users = [] as Array<User>
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
const fixUser = (catterpillar: Catterpillar) => {
  const centerPoint = Matter.Bodies.circle(targetEl.clientWidth/2,targetEl.clientHeight/3, 5, {
      label: "centerPoint",
      isStatic: true
  })

  const constraintA = Matter.Constraint.create({
      bodyA: centerPoint,
      bodyB: catterpillar.head,
      stiffness: 0.02,
      damping: 0.02,
      length:1,
      render: {
          strokeStyle: "#9f0",
          type: "line"
      }
  })

  Matter.Composite.add(mjs.world,[centerPoint, constraintA])
}



const socket = io("http://localhost:3000");

if (mainScreen) {
  socket.on("addNewUser", data => {
    
    const newUser = {
        catterpillar: new Catterpillar(mjs.world, targetEl, {
          x: targetEl.clientWidth / 2,
          y: 8,
          autoBlink: true,
          ...data
        }),
        id: data.userId
    }
    users.push(newUser)

    Matter.Composite.add(mjs.world, [
      newUser.catterpillar.composite
    ])
  })

  socket.on("removeUser", (data) => {
    const removedUsers = _.remove(users, {id: data.userId})
    if (removedUsers.length <= 0) {
      console.warn(`on:removeUser | Can not find user ${data.userId}`)
      return
    }
    const user = removedUsers[0]
    user.catterpillar.remove()
  })
  
  socket.on("userAction", (data: {
    type: "move" | "text"
    value: string
    userId: string
  }) => {
    const user = _.find(users, {id: data.userId})
    if (!user) {
      console.warn(`on:userAction | Can not find user ${data.userId}`)
      return
    }

    if (data.type == "move") {
      if (data.value.toLowerCase() == "left") {
        user.catterpillar.moveLeft()
      } else {
        user.catterpillar.moveRight()
      }
    }
    
    if (data.type == "text") {
      user.catterpillar.speak(data.value, 24)

    }
  })
  document.body.classList.add("__isMain")
  
} else {
  // const socket = io("https://payload.jeffreyarts.nl");
  const newUser = {
    catterpillar: new Catterpillar(mjs.world,
      targetEl,
      {
        x: targetEl.clientWidth / 2,
        y: 8,
        autoBlink: true,
        ...catterpillarOptions
      }
    ),
    id: hash(catterpillarOptions),
    socket: socket
  }

  new UserControl(newUser, {
      left: document.getElementById("moveLeft"), 
      right: document.getElementById("moveRight"),
      message: document.getElementById("messageForm")
    }
  )

  users.push(newUser)
  fixUser(newUser.catterpillar)

  socket.emit('newUser', {...catterpillarOptions, userId: hash(catterpillarOptions)})

  Matter.Composite.add(mjs.world, [
    newUser.catterpillar.composite
  ])
}
const checkOffscreen = () => {
  if (users.length > 0 ) {
    users.forEach(user => {
      if (catterpillarService.isOutsideCanvas(user.catterpillar, targetEl)){
        const catterpillarOptions = {
          color: user.catterpillar.color,
          length: user.catterpillar.bodyLength,
          maxVelocity: user.catterpillar.maxVelocity,
          stiffness: user.catterpillar.stiffness,
          restitution: user.catterpillar.restitution,
          bodyPart: user.catterpillar.bodyPart
        }
        user.catterpillar.remove()
        user.catterpillar = new Catterpillar(mjs.world, targetEl, {
              x: targetEl.clientWidth / 2,
              y: 8,
              autoBlink: true,
              ...catterpillarOptions
        })
        
        Matter.Composite.add(mjs.world, [
          user.catterpillar.composite
        ])
      }
    })
  }
  requestAnimationFrame(checkOffscreen)
}
requestAnimationFrame(checkOffscreen)


