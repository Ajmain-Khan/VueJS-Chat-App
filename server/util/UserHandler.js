const { mongoose } = require('mongoose');
const { User } = require('./dbutils.js')
db = mongoose.connect('mongodb://localhost/rizzchat')

let users = []
let socket_db_map = [];
// let users = new Set();

async function getMongoId(_username){
    try {
        // Use the Mongoose `findOne()` method to find a user with the given username
        const user = await User.findOne({ username: _username });
    
        // If no user is found, return null
        if (!user) {
          return null;
        }
    
        // If a user is found, return their `_id` value
        return user._id;
      } catch (error) {
        // Handle any errors that occurred during the search
        console.error(error);
        return null;
      }
}

function joinUser(id, username, room) {
    
    let user = { id, username, room };
    users.push(user);
    return user;
}

function getUserMongoId(socket_id){
    let user = users.find( user => user.id === id);
    return user.mongo_id;
}

function getUserSocketId(mongo_id){
    let user = users.find( user => user.mongo_id === mongo_id )

}

function getCurrentUser(id) {
    const user =  users.find( user => user.id === id );
    if (!user){
        console.log("No user found!")
    }
    return user
}

function findByUsername(username){
    return users.find( user => user.username == username )
}

function userLeft(id) {
    let index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeft,
    getRoomUsers,
    findByUsername,
    getMongoId
};