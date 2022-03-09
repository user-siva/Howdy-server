const io = require("socket.io")(8900,{
    cors : {
        origin:"http://localhost:3000"
    }
})

let users = []

const addUser = (userId,socketId) => {
    !users.some(user => user.userId === userId) && 
    users.push({userId,socketId})
    console.log(users)
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    console.log("getUser:",users.find((user) => user.userId === userId))
    return users.find((user) => user.userId === userId)
}


io.on("connection",(socket) => {
    //connect
    console.log("User connected",socket.id)

    socket.on("addUser",(userId) => {
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    })
    //send and get message
    socket.on("sendMsg",({senderId,receiverId,text}) => {
        console.log(receiverId)
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMsg",{
            senderId,
            text,
        })
    })

    //disconnect
    socket.on("disconnect",() => {
        console.log("user disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})
