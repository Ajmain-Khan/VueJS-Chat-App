<template>
  <div class="grid-container">
    <div class="grid-item header">Header</div>
    <div class="grid-item sidebar">
      <div>
        <p>Sidebar content</p>
      </div>
      <div>
        <input v-model="username" class="input" type="text" placeholder="Test username" />
      </div>
      <button class="button is-link" @click="connect">
        <span>Connect</span>
      </button>
      <div>
        <input v-model="sendTo" class="input" type="text" placeholder="Send to..." />
      </div>
      <br />
      <div v-if="openChats" class="grid-item" ref="sidebar">
        <div v-for="conversation in openChats" :key="conversation.props.lastMessageTime">
          <component
            :is="conversation.component"
            v-bind="conversation.props"
            @open="openConvo"
          ></component>
        </div>
      </div>
    </div>
    <div class="grid-item chatbox" ref="chatbox">
      Chatbox
      <div v-for="message in messages" :key="message.time">
        <component :is="message.component" v-bind="message.props"></component>
      </div>
    </div>
    <div class="grid-item input-bar">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            v-model="messageOut"
            @keyup.enter="sendDM"
            type="text"
            class="input"
            ref="input_bar"
            placeholder="Type here..."
            autocomplete="off"
          />
        </div>
        <div class="control has-icon-right is-expanded">
          <button class="button is-link" @click="sendDM">
            <span>Send</span>
            <span class="icon is-right">
              <i class="fas fa-paper-plane"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, shallowRef } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import io from 'socket.io-client'
import moment from 'moment'

export default {
  data() {
    return {
      socket: null,
      messageOut: '',
      messageIn: '',
      username: '',
      sendTo: '',
      room: 'room1',
      currentConvo: '',
      messages: [], // Used to populate the chatbox with messages
      conversations: [{}], // Used to keep track which conversation messages belong to
      openChats: [] // Used to populate list of conversations in the sidebar
    }
  },
  methods: {
    connect() {
      this.socket = io('http://localhost:3000')

      this.socket.on('connect', (res) => {
        console.log('Connected to server')
        console.log(res)
      })

      let username = this.username
      let room = this.room
      this.socket.emit('joinChat', { username, room })

      this.fetchMessages()

      this.socket.on('msg', (msg) => {
        let [inUsername, inMsg, time] = [msg.username, msg.msg, this.getTimeString()]
        if (this.currentConvo === inUsername || username === inUsername) {
          this.outputMessage(inUsername, inMsg, time)
        }
        this.addToConvo(inUsername, username, inMsg, time)
      })
    },
    fetchMessages() {
      fetch('http://localhost:3000/get-messages/' + this.username)
        .then((result) => result.json())
        .then((msgArray) => {
          console.log(msgArray)
          msgArray.forEach((msg) => {
            const sender = msg.sender
            const receiver = msg.recipient
            const text = msg.message
            const time = moment(msg.time).format('hh:mm A')
            // this.outputMessage(sender, text, time)
            this.addToConvo(sender, receiver, text, time)
          })
        })
        .catch((e) => console.log(e))
    },
    openConvo(user) {
      this.messages = [] // clear chatbox
      this.sendTo = user // set selected user to receive messages
      this.currentConvo = user // same as sendTo, might delete this later

      let msgToShow = this.getConvoMessages(user) // Get conversation with selected user

      msgToShow.forEach((msg) => {
        // display every message with selected used
        this.outputMessage(msg.props.username, msg.props.message, msg.props.time)
      })

      let chat = this.$refs.chatbox
      chat.scrollTop = chat.scrollHeight
    },
    addToConvo(sender, receiver, text, time) {
      // If it's our own message being sent back to us by the socket, just ignore it
      if (sender === receiver) {
        return 0
      }

      // When getting the messages from the API at connection time,
      // we get messages that are either sent or received by the client,
      // So we need to define who's the sender
      let otherUser
      if (sender === this.username) {
        otherUser = receiver
      } else {
        otherUser = sender
      }

      // Get the conversation that is with the user from the input message
      let conversation = this.conversations.find((convo) => convo.with === otherUser)
      // Make message component with selected props
      let message = this.makeMessage(sender, text, time)

      // Message to be displayed as the last message on the conversation in the sidebar
      // for this specific conversation. If message is too long, add ellipses in the thumbnail
      let displayMessage = message.props.message
      if (displayMessage.length > 18) {
        displayMessage = displayMessage.substring(0, 16) + '...'
      }

      // Here it checks if we alrady have a conversation open with this user or not
      // If we do, update the sidebar convo box. If not, create a new one and add to this.openChats
      if (conversation) {
        conversation.messages.push(message)
        conversation.last = time

        let chat = this.openChats.find((convo) => convo.props.contactUsername === otherUser)
        const chatIndex = this.openChats.indexOf(chat)
        chat.props.lastMessage = displayMessage
        chat.props.lastMessageTime = time

        // Remove chat from the last a put it on the top
        this.openChats.splice(chatIndex, 1)
        this.openChats.unshift(chat)
      } else {
        // create new conversation to add to this.openChats
        let newConvo = { with: otherUser, messages: [message], last: time }
        this.conversations.push(newConvo)

        const chatSide = shallowRef(
          defineAsyncComponent(() => import('../components/ChatSide.vue'))
        )
        this.openChats.unshift({
          component: chatSide,
          props: {
            contactUsername: otherUser,
            lastMessage: displayMessage,
            lastMessageTime: time
          }
        })
      }
    },
    getConvoMessages(user) {
      let convo = this.conversations.find((convo) => convo.with === user)
      return convo.messages
    },
    sendDM() {
      // doesn't do anything if input is empty
      if (this.messageOut.length == 0) {
        return 0
      }

      const sendTo = this.sendTo
      const msg = this.messageOut
      console.log('Socket emited dm')
      this.socket.emit('dm', { sendTo, msg })
      this.addToConvo(this.username, sendTo, msg, this.getTimeString())
      this.messageOut = ''
      this.$refs.input_bar.focus()
    },
    sendMessage() {
      // Not doing anything rn. Just DMs are being used
      if (this.messageOut.length == 0) {
        // doesn't do anything if tries to send with empty input
        return 0
      }

      // Send message to server
      this.socket.emit('msg', this.messageOut)
      const chatMessage = defineAsyncComponent(() => import('../components/ChatMessage.vue'))

      // Clear out input bar and re-focus on it
      this.messageOut = ''
      this.$refs.input_bar.focus()
    },
    /**
     * Function makes a ChatMessage.vue component. These are added to the list of messages
     * to be displayed and on the list of open conversations for retrieval.
     * @param {*} username
     * @param {*} message
     * @param {*} time
     */
    makeMessage(username, message, time) {
      const chatMessage = shallowRef(
        defineAsyncComponent(() => import('../components/ChatMessage.vue'))
      )
      chatMessage.props = { username: username, message: message, time: time }
      return chatMessage
    },
    outputMessage(_username, _message, _time) {
      const chatMessage = shallowRef(
        defineAsyncComponent(() => import('../components/ChatMessage.vue'))
      )
      this.messages.push({
        component: chatMessage,
        props: {
          username: _username,
          message: _message,
          time: _time
        }
      })

      // For the chatbox to always display the latest message
      // without the need for the user to scroll down.
      let chat = this.$refs.chatbox
      chat.scrollTop = chat.scrollHeight
    },
    getTimeString() {
      return moment().format('hh:mm A')
    }
  },
  beforeUnmount() {
    this.socket.disconnect()
  }
}
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 2fr 6fr;
  grid-template-rows: 50px 700px 50px;
  justify-content: center;
  align-content: center;
  height: auto;
  background: linear-gradient(to bottom right, #822796, #312de3);
  padding: 10px;
}
.header {
  grid-column-start: 1;
  grid-column-end: -1;
}
.sidebar {
  grid-row-start: 2;
  grid-row-end: -1;
  overflow-y: scroll;
}
.chatbox {
  overflow-y: scroll;
}
.input-bar {
  grid-column-start: 2;
  grid-column-end: -1;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 5px;
  font-size: 25px;
  text-align: center;
}
</style>
