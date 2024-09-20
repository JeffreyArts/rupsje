# Installation

Create a .env file with the following parameter:

```
VITE_SOCKET_IO=http://localhost:3000
```

Where `http://localhost:3000` is the location of your socketIO server.


On your socketIO server, you can use the following code to handle the messages. Depending on your configuration, you'll need to make some changes. But in essence this code accepts the following incoming messages:

- newUser
- speak
- move
- disconnect

Of which it broadcasts to all connected sockets - respectively - the following messages:
- addNewUser
- userAction {type:text}
- userAction {type:move}
- removeUser

```
const rupsDemo = (socket: Socket, io:Server) => {
    socket.on("newUser", data => {
        io.emit("addNewUser", data)
        socket.data.userId = data.userId
    })
    
    socket.on("speak", data => {
        io.emit("userAction", {
            type: "text",
            value: data.value,
            userId: data.userId
        })
        
    })

    socket.on("move", data => {
        io.emit("userAction", {
            type: "move",
            value: data.value,
            userId: data.userId
        })
    })
    
    socket.on("disconnect", () => {
        io.emit("removeUser", {userId: socket.data.userId})
    })
}

```


Check [this page](https://github.com/JeffreyArts/server/wiki/Vite-website-setup) for details on the deploy script that allows this project to be deployed via `yarn deploy`