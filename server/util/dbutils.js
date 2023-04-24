const { mongoose, Schema } = require('mongoose');

const users = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String
})

const chats = new Schema({
    roomId: String,
    messages: [{
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true
        }
    }],
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
})

const messages = new Schema({
  sender: String,
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: String,
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messages);


db = mongoose.connect('mongodb://localhost/rizzchat')

const User = mongoose.model('Users', users)
const Chat = mongoose.model('Chats', chats)
const Message = mongoose.model('Messages', messages)

module.exports = {
    User,
    Chat,
    Message
};