const { log } = require('console');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.render('main');
});

let users={};
let i=0;

io.on('connection', socket => {
    socket.on('newUser',(newPerson)=>{
        users[socket.id] = newPerson;
        console.log(users);
    });

    socket.on('send',(message,room,name)=>{
        console.log(message,room,name);
        if(!room){
            socket.broadcast.emit('recieve',message);
        }else{
            console.log('Group message',message,name);
            socket.to(room).emit('recieve',message,name);
        }
    });

    socket.on('join-room',room=>{
        console.log(room);
        socket.join(room);
    })
});

const PORT =3000;

server.listen(PORT, () => {
    console.log(`Server started`);
});
