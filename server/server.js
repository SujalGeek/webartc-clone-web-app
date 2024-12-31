const {Server} = require("socket.io")

// PORT 8000
const io = new Server(8000)
// Connection
io.on('connection',(socket)=>{
    console.log("Socket connected",socket.id)
})