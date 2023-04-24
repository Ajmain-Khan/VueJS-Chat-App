// Import required packages and frameworks
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const handleMessage = require('./util/MessageHandler');
const { joinUser, getCurrentUser, userLeft, getRoomUsers, findByUsername, getMongoId } = require('./util/UserHandler');
const { User, Chat, Message } = require('./util/dbutils');

// Initiate express service 
let app = express();
app.use(bodyParser.json());
let server = http.createServer(app);

// Start socket and allow CORS
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

// Set of chatrooms. Set data structure is used so that 
// there are no duplicates. 
let chatrooms = new Set();

// Opens up public folder for client usage
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// Server messages to chat will be sent from "Administrator"
let admin = 'Administrator';


// Initially handle connection to server through sockets
io.on('connection', function(socket) {
    // console.log('New WS Connection...');

    // Once new client joins a chatroom, client socket sends
    // a 'joinChat' message to the server containing the username
    // and room name they are joining
    socket.on('joinChat', function({username, room}) {

        // joinUser function on the utility/userHandler.js file 
        // joins user to the room so that socket can broadcast
        // to users in the same room
        let user = joinUser(socket.id, username, room);
        console.log('user joined in')
        socket.join(user.room);
        
        // Add room to set of currently open rooms
        chatrooms.add(user.room)

        // Server emits to all rooms the addition of the newest one. 
        // This allows the client to refresh the chatroom list so that
        // other users can join it
        socket.broadcast.emit('newRoom', room)

        //Sends message to user when they first connect to a room
        socket.emit('msg', handleMessage(admin, 'Welcome to chat!'));

        //Broadcasts to all other users is the same room that the new user connected
        socket.broadcast.to(user.room).emit('msg', handleMessage(admin, `${user.username} has joined!`));

        // Emit to clients of the room the updated list of users in that room
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
    });

    // Clients can optionally request the server to send them an updated
    // list of open rooms. Here the server responds with the set of rooms
    socket.on('getUpdatedRoomList', (room, callback) => {
        callback(Array.from(chatrooms)); // Set must be converted to Array because sockets can only
    })                                 // send primitive data types.

    socket.on('dm', ({sendTo, msg}) => {
        console.log("Send to: ", sendTo)
        console.log("Message: ", msg)
        const sender = getCurrentUser(socket.id);
        const receiver = findByUsername(sendTo);
        const message = handleMessage(sender.username, msg)

        if(!receiver){ 
            // If receiver is not online, just send message back to
            // the sender. Recipient will get it once they log back in
            io.to(sender.id).emit('msg', message)
        } else {
            // otherwise send it to both.
            // Sender gets it back so client can put it on the screen
            io.to(sender.id).to(receiver.id).emit('msg', message) 
        }
        console.log("Archive message function")
        archiveMessage(msg, sender.username, sendTo)
    })

    /**
     * Function takes a msg, sender username and recipient username and
     * stores it on the messages collection in the `rizzchat` database. 
     * User and Recipient _ids are retrieved from the util::UserHandler::getMongoId()
     * function, that queries the database by username and returns the ObjectId.
     * @param {*} msg 
     * @param {*} sender 
     * @param {*} receiver 
     */
    async function archiveMessage(msg, sender, receiver){
        console.log('archive called')

        getMongoId(sender)
            .then(sender_id => {
                getMongoId(receiver)
                .then(receiver_id => {
                    const newMessage = Message({
                        sender: sender,
                        sender_id: sender_id,
                        recipient: receiver,
                        recipient_id: receiver_id,
                        message: msg,
                        time: Date()
                    })
                    
                    newMessage.save();
                    console.log("Message saved")
                })
            })
    }

    // Server handles new messages from users.
    socket.on('msg', async function(msg) {
        let user = getCurrentUser(socket.id); // get the id of the user that send the message.

        io.to(user.room).emit('msg', handleMessage(user.username, msg)); // Send message to users in the same room.
    });

    // Server handles event of user leaving a room.
    // Here the server emits to all users in the room a message
    // informing that the user left.
    socket.on('disconnect', function() {
        let user = userLeft(socket.id); // get the id of the user that left
        if(user) {
            io.to(user.room).emit('msg', handleMessage(admin, `${user.username} has left the chat!`)); // Message informing user left
            io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)}); // Server sends updated list of users in that room
        }
    });
});


// Server uses port 3000 or an available port from the environment 
let PORT = process.env.PORT || 3000;

/**
 * REST endpoint for adding a new user to the database.
 * Expects a JSON file with 
 *      username: String,
 *      firsname: String,
 *      lastname: String,
 *      email: String,
 *      password: String
 *
 * Before inserting, it checks if the database already contains
 * a user with the same username or same email and responds to
 * the client with a status code 400 if so. 
 * 
 * Note: I had to nested if-else because I kept getting
 *          [ERR_HTTP_HEADER_SENT].
 *      There might be a better looking way to send a response
 *      depending on condionals.
 */
app.post('/new-user', (req, res) => {
    const info = req.body
    User.find({username: info.username})
        .then(result => {
            if (result.length > 0) {
                res.status(400).send("400 Username already taken")
            } else {
                User.find({email: info.email})
                    .then(result => {
                        if (result.length > 0) {
                            res.status(400).send("400 Email already in use")
                        } else {
                            const newUser = User({
                                username: info.username,
                                firstname: info.firstname,
                                lastname: info.lastname,
                                email: info.email,
                                password: info.password
                            })
                            newUser.save();
                            res.status(200).send("200 User saved.");

                        }
                    })

                }
        })

})

/**
 * Server endpoint used for authenticating user login. Client
 * makes a post request with the following JSON object:
 *      {
 *          username: String,
 *          password: String
 *      }
 * and the server queries the database for the user with the
 * provided info to check if the username and password match.
 * If the query has a result, meaning it found a user with
 * the same username and password, the server responds with
 * a status code 200. Otherwise, it responds with a status codet st 400. 
 */
app.post('/login-auth', (req, res) => {
    const userData = req.body;
    console.log("loggin attempt")
    User.find({username: userData.username, password: userData.password})
        .then(result => {
            if (result.length > 0) {
                res.status(200).send("200 User authenticated");
            } else {
                res.status(400).send("400 User authentication failed");
            }
        })
})

/**
 * Endpoint to retrieve information about a user
 * based on their username, which is passes as a
 * URL parameter. Includes their password lol
 */
app.get('/get-user-info/:username', (req, res) => {
    const user = req.params.username;
    User.find({username: user})
        .then(result => {
            res.json(result);
        })
})

/**
 * Endpoint checks if user exists for when a client
 * wishes to start a new conversation. Returns true if the 
 * database contains a user with the same username as the 
 * parameter. Otherwise returns false. 
 * @param {*}
 */
app.get('/check-user/:username', (req, res) => {
  const user = req.params.username;
  User.find({username: user})
      .then(result => {
          if (result.length > 0) {
              res.status(200).send('200 User exists')
          } else {
              res.status(400).send('400 User does not exist')
          }
      })
})


/**
 * This is the endpoint the clients will call to get all 
 * saved messages from or to the user. Returns a list
 * of JSON objects containing messages (_id, sender, recipient, msg, time)
 * where eithe `sender` of `recipient` is the _id of the user as
 * per the rizzchat.users collection.
 */
app.get('/get-messages/:username', (req, res) => {
    const user = req.params.username;
    getMongoId(user)
        .then(user_id => {
            Message.find().or([{ sender_id: user_id}, {recipient_id: user_id}]).sort('time')
                .then(messages => {
                    res.json(messages)
                })
                .catch(e => res.status(500).send(e))
        }).catch(e => res.status(500).send(e))
})


// Finally, server is open to listen for connections.
server.listen(PORT, function() {
    console.log('Listening for requests on port '+PORT);
});

