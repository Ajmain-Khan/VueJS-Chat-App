<script>
export default {
  name: 'LoginModal',
  props: ['loginModalActive'],
  setup(props, { emit }) {
    const close = () => {
      emit('close')
    }

    return { close }
  },
  data() {
    return {
      username: '',
      password: '',
      loginFailed: false
    }
  },
  methods: {
    loggin() {
      fetch('http://localhost:3000/login-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
        .then((response) => response.text())
        .then((res) => {
          let status = res.split(' ')[0]
          if (status === '200') {
            console.log('log in succesful')
            localStorage.setItem(
              'userSession',
              JSON.stringify({
                isLoggedIn: true,
                username: this.username
              })
            )
            this.$router.push({ path: '/chat' })
          } else {
            console.log(res)
            console.log('login failed :(')

            //This will help set the CSS for the input boxes
            this.loginFailed = true
            // this.username = '',
            // this.password = ''
          }
        })
        .catch((e) => console.log(e))
    }
  }
}
</script>

<template>
  <Transition name="modal-animation">
    <div class="modal" v-if="loginModalActive">
      <div class="modal-container" v-if="loginModalActive">
        <div v-if="loginFailed" class="invalid-login">
          <span>Invalid login!</span>
        </div>
        <i class="cross-svg" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            fill="rgb(204, 0, 255)"
            viewBox="-44.1 -44.1 308.70 308.70"
            style="width: 1.8rem; height: 1.8rem"
          >
            <path
              d="M0.003,192.658c0,7.434,2.897,14.424,8.154,19.684c5.257,5.261,12.25,8.154,19.684,8.154 c7.44,0,14.429-2.894,19.674-8.154l62.732-62.731l62.717,62.72c5.255,5.26,12.244,8.154,19.684,8.154 c7.44,0,14.436-2.895,19.678-8.154c5.255-5.26,8.155-12.25,8.155-19.684s-2.9-14.424-8.155-19.684l-62.714-62.717l62.727-62.727 c5.254-5.257,8.154-12.247,8.154-19.681c0-7.434-2.9-14.427-8.154-19.684C207.084,2.897,200.095,0,192.655,0 c-7.435,0-14.424,2.897-19.678,8.155l-62.724,62.732L47.522,8.155C42.271,2.897,35.281,0,27.847,0 c-7.44,0-14.433,2.897-19.684,8.155c-5.257,5.257-8.155,12.25-8.155,19.684c0,7.434,2.897,14.423,8.155,19.681l62.732,62.727 L8.157,172.974C2.9,178.234,0.003,185.224,0.003,192.658z M16.858,181.681l67.08-67.086c1.156-1.152,1.801-2.714,1.801-4.344 c0-1.631-0.646-3.198-1.801-4.348l-67.08-67.08c-2.939-2.936-4.552-6.836-4.552-10.985c0-4.152,1.618-8.056,4.552-10.989 c2.939-2.933,6.831-4.552,10.989-4.552c4.149,0,8.055,1.619,10.98,4.552l67.079,67.077c2.306,2.306,6.39,2.306,8.695,0 l67.07-67.077c5.867-5.873,16.104-5.861,21.972,0c2.937,2.939,4.552,6.836,4.552,10.989c0,4.149-1.615,8.056-4.552,10.985 l-67.073,67.074c-2.402,2.404-2.402,6.29,0,8.697l67.062,67.056c2.936,2.937,4.545,6.84,4.545,10.989s-1.609,8.053-4.551,10.988 c-5.85,5.867-16.094,5.873-21.966,0l-67.059-67.056c-2.405-2.407-6.29-2.407-8.695,0l-67.085,67.08 c-5.846,5.866-16.09,5.872-21.962,0c-2.939-2.937-4.552-6.84-4.552-10.989C12.307,188.515,13.919,184.612,16.858,181.681z"
            ></path>
          </svg>
        </i>
        <header class="modal-header">
          <h1>Login</h1>
        </header>

        <div class="modal-body">
          <div class="input_form">
            <div class="username_input">
              <i class="user-svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  fill="rgb(255, 0, 255)"
                  style="width: 1.5rem; height: 1.5rem"
                >
                  <path
                    d="M843.282963 870.115556c-8.438519-140.515556-104.296296-257.422222-233.908148-297.14963C687.881481 536.272593 742.4 456.533333 742.4 364.088889c0-127.241481-103.158519-230.4-230.4-230.4S281.6 236.847407 281.6 364.088889c0 92.444444 54.518519 172.183704 133.12 208.877037-129.611852 39.727407-225.46963 156.634074-233.908148 297.14963-0.663704 10.903704 7.964444 20.195556 18.962963 20.195556l0 0c9.955556 0 18.299259-7.774815 18.962963-17.73037C227.745185 718.506667 355.65037 596.385185 512 596.385185s284.254815 122.121481 293.357037 276.195556c0.568889 9.955556 8.912593 17.73037 18.962963 17.73037C835.318519 890.311111 843.946667 881.019259 843.282963 870.115556zM319.525926 364.088889c0-106.287407 86.186667-192.474074 192.474074-192.474074s192.474074 86.186667 192.474074 192.474074c0 106.287407-86.186667 192.474074-192.474074 192.474074S319.525926 470.376296 319.525926 364.088889z"
                  />
                </svg>
              </i>
              <input
                :class="{ 'outline-red': loginFailed }"
                v-model="username"
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
            </div>

            <div class="password_input">
              <i class="pass-svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 32 32"
                  fill="rgb(255, 0, 255)"
                  style="width: 1.4rem; height: 1.4rem"
                >
                  <path
                    d="M25 12h-1v-3.816c0-4.589-3.32-8.184-8.037-8.184-4.736 0-7.963 3.671-7.963 8.184v3.816h-1c-2.206 0-4 1.794-4 4v12c0 2.206 1.794 4 4 4h18c2.206 0 4-1.794 4-4v-12c0-2.206-1.794-4-4-4zM10 8.184c0-3.409 2.33-6.184 5.963-6.184 3.596 0 6.037 2.716 6.037 6.184v3.816h-12v-3.816zM27 28c0 1.102-0.898 2-2 2h-18c-1.103 0-2-0.898-2-2v-12c0-1.102 0.897-2 2-2h18c1.102 0 2 0.898 2 2v12zM16 18c-1.104 0-2 0.895-2 2 0 0.738 0.405 1.376 1 1.723v3.277c0 0.552 0.448 1 1 1s1-0.448 1-1v-3.277c0.595-0.346 1-0.985 1-1.723 0-1.105-0.895-2-2-2z"
                  />
                </svg>
              </i>
              <input
                :class="{ 'outline-red': loginFailed }"
                v-model="password"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
            </div>
          </div>

          <button @click="loggin" class="form_button glow-on-hover" type="submit" value="Login">
            Login
          </button>
          <br />
          <button class="form_button glow-on-hover cancel" @click="close" type="button">
            Cancel
          </button>
        </div>

        <footer class="modal-footer">
          <h5>
            Don't have an account?
            <a>Register.</a>
          </h5>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -2rem;
}

h5 {
  font-weight: 300;
  top: 1rem;
}

i {
  stroke: rgb(255, 0, 255);
  stroke-width: 1px;
  margin: auto;
  margin-left: 10px;
  vertical-align: middle;
  fill: currentColor;
}

i.user-svg {
  stroke-width: 50px;
}

i.cross-svg {
  stroke: rgb(204, 0, 255);
  position: absolute;
  top: 40px;
  right: 35px;
  padding: 5px;
  padding-bottom: 0px;
  stroke-width: 45;
  cursor: pointer;
}

.modal {
  position: fixed;
  display: flex;
  inset: 0;
  /* z-index: 9998; */
  background-color: rgba(29, 0, 32, 0.7);
}

.modal-container {
  position: relative;
  margin: auto;
  width: 500px;
  height: 700px;
  padding: 105px 0;
  text-align: center;
  border-radius: 20px;
  background-image: linear-gradient(
    135deg,
    rgba(22, 0, 46, 1) 10%,
    rgba(133, 11, 126, 1) 35%,
    rgba(115, 13, 148, 1) 72%,
    rgba(75, 55, 255, 1) 100%
  );
  box-shadow: -1px 1px 12px 3px rgba(130, 0, 170, 0.8), 5px 0 0 -1px rgba(218, 96, 255, 0.8),
    inset 0 15px 2px rgba(255, 0, 234, 0.3), inset 0 -15px 2px rgba(255, 0, 234, 0.3);
}

.username_input,
.password_input {
  display: flex;
  justify-content: left;
  border-bottom: 2px solid white;
  margin: 3rem auto;
  width: 60%;
  height: 40px;
}

.input_form {
  margin-bottom: 4rem;
}

input {
  color: white;
  height: 40px;
  padding: 2%;
  padding-right: 30%;
  padding-bottom: 15px;
  font-size: medium;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  border: none;
  background-color: transparent;
}
.invalid-login {
  background-color: red;
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem;
  text-align: center;
}

::placeholder {
  color: lightgray;
}

input:focus::placeholder {
  color: rgb(255, 255, 255, 0.1);
}

input:focus {
  outline: none;
}

button {
  cursor: pointer;
  min-width: 40%;
  padding: 2.5% 5%;
  margin: 1rem 0;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: medium;
  font-weight: bold;
  border: none;
  background-color: black;
}

button:first-of-type {
  margin-bottom: 1.5rem;
}

/******************* ANIMATIONS *******************/
/* -- MODAL FADE IN -- */
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.4s cubic-bezier(0.5, 0.05, 0.2, 1.1);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

/* -- MODAL CONTENT ZOOM/FADE IN ANIMATION -- */
.modal-animation-enter-active .modal-container {
  transition: all 0.4s cubic-bezier(0.5, 0.05, 0.2, 1.1) 0.1s;
}

.modal-animation-leave-active .modal-container {
  transition: all 0.4s cubic-bezier(0.5, 0.05, 0.2, 1.1);
}

.modal-animation-enter-from .modal-container {
  opacity: 0;
  transform: scale(0.85);
}
.modal-animation-leave-to .modal-container {
  transform: scale(0.85);
}

/* GLOW ON HOVER */
.glow-on-hover {
  border: 3px outset rgba(255, 255, 255);
  outline: none;
  position: relative;
  z-index: 0;
  border-radius: 10px;
}

.glow-on-hover:before {
  content: '';
  background: linear-gradient(
    45deg,
    red,
    orange,
    yellow,
    rgb(0, 255, 0),
    rgb(38, 255, 233),
    blue,
    rgb(183, 0, 255),
    rgb(255, 0, 242),
    red
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

.glow-on-hover:active {
  color: black;
}

.glow-on-hover:active:after {
  background: transparent;
}

.glow-on-hover:hover:before {
  opacity: 1;
}

.glow-on-hover:after {
  z-index: -1;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  left: 0;
  top: 0;
  border-radius: 10px;
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
