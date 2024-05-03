require('dotenv').config()

const io = require('socket.io') (9800, {
    cors: {
        origin: process.env.BASE_URL,
        methods: ["GET", "POST"]
    },
});

let users = [];

const handleAddUser = (userId, socketId) => {
    console.log(userId, socketId);
   !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const handleRemoveUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    console.log(users);
    return users.find(user => user.userId === userId)
};


io.on('connection', (socket) => {
    console.log('User Connected');
   //When user connecting to network
    socket.on('addUser', userId => {
        handleAddUser(userId, socket.id);
        io.emit('getUsers', users); 
    })

    //send message
    socket.on('sendMessage',({senderId, recieverId, text}) => {
        const user = getUser(recieverId);
        io.to(user?.socketId).emit('getMessage', {
            senderId,
            text
        });
    });


    //When user disconnection from network
    socket.on('disconnect', () => {
        console.log('user disconnected');
        handleRemoveUser(socket.id);
        io.emit('getUsers', users); 
    })
})