const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static("public"));

const users = new Set();

io.on("connection", (socket) => {
  console.log("A user is now connected");
  // handle user join the chat
  socket.on("join", (userName) => {
    users.add(userName);
    socket.userName=userName

    io.emit("userJoined", userName);

    io.emit("userList", Array.from(users));
  });
  // handel the message
socket.on("chatMessage",(message)=>{

    io.emit("chatMessage",message)

})
  // handle when user disconnect

  socket.on("disconnect",()=>{
console.log("user is disconencted");
users.forEach(user => {
    if(user===socket.userName){
        users.delete(user);
        io.emit("userLeft",user)
        io.emit("userList",Array.from(users))
    }
    
});

  

})

});

const PORT =3000;
server.listen(PORT,()=>{
    console.log("server is now running");
    
})
