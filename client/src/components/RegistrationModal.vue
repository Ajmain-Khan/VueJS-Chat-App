<script>
export default {
  name: 'RegistrationModal',
  props: ['registrationModalActive'],
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      accepted: false,
      status: ''
    }
  },
  methods: {
    submitHandler() {
      const data = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
        password: this.password
      }
      console.log(data)
    },
    clearForm() {
      ;(this.firstname = ''),
        (this.lastname = ''),
        (this.email = ''),
        (this.username = ''),
        (this.password = '')
    },
    signup() {
      fetch('http://localhost:3000/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        })
      })
        .then((response) => response.text())
        .then((res) => {
          let status = res.split(' ')[0]
          let error = res.split(' ')[1]
          if (status === '200') {
            console.log('Account created')
            this.status = 'Account created'
            this.accepted = true
            this.getUserMongoId()
          } else if (error === 'Username') {
            this.status = 'Username already taken'
            this.accepted = true
          } else if (error === 'Email') {
            this.status = 'Email already in use'
            this.accepted = true
          }
        })
        .catch((e) => console.log(e))
    },
    getUserMongoId() {
      console.log('Ate aqui deu')
      fetch('http://localhost:3000/get-user-info/' + this.username)
        .then((result) => {
          console.log(result)
        })
        .catch((e) => console.log(e))
    }
  },
  setup(props, { emit }) {
    const close = () => {
      emit('close')
    }

    return { close }
  }
}
</script>

<template>
  <Transition name="modal-animation">
    <div class="modal" v-if="registrationModalActive">
      <div class="modal-container" v-if="registrationModalActive">
        <div class="modal-header">
          <div class="icon">
            <img src="../assets/registration/xmlid3205587-j0m.svg" class="xmlid320" />
            <img src="../assets/registration/xmlid3195588-ll98.svg" class="xmlid319" />
            <img src="../assets/registration/xmlid3185589-vbf.svg" class="xmlid318" />
            <img src="../assets/registration/xmlid3175590-qit.svg" class="xmlid317" />
          </div>
          <span class="text-start">Start Chatting Now!</span>
          <br />
          <span class="text-new-account">Create new account<span style="color: aqua">.</span></span>
        </div>

        <div class="modal-body">
          <div class="register-form">
            <form @submit.prevent="submitHandler(), signup(), clearForm()">
              <div class="form-row1">
                <div class="firstname_input">
                  <label class="label_fname">First Name</label>
                  <input
                    type="text"
                    v-model="firstname"
                    id="firstname"
                    name="firstname"
                    placeholder="John"
                    required
                  />
                </div>
                <div class="lastname_input">
                  <label class="label_lname">Last Name</label>
                  <input
                    type="text"
                    v-model="lastname"
                    id="lastname"
                    name="lastname"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div class="form-row2">
                <div class="email_input">
                  <label class="label_email">Email</label>
                  <input
                    type="email"
                    v-model="email"
                    id="email"
                    name="email"
                    placeholder="@example.com"
                    required
                  />
                </div>
              </div>

              <div class="form-row3">
                <div class="username_input">
                  <label class="fname">Username</label>
                  <input
                    type="text"
                    v-model="username"
                    id="username"
                    name="username"
                    placeholder="JohnDoe2023"
                    required
                  />
                </div>
                <div class="password_input">
                  <label class="lname">Password</label>
                  <input
                    type="password"
                    v-model="password"
                    id="password"
                    name="password"
                    placeholder="•••••••••"
                    required
                  />
                </div>
              </div>
              <div class="button-panel">
                <button type="reset" id="cancel" @click="clearForm(), close()">Cancel</button>
                <button type="submit" id="submitbtn">Create Account</button>
              </div>
            </form>
          </div>

          <span class="text-member">
            Already A Member?
            <a>Log In</a>
          </span>
          <div v-if="accepted">
            <p>{{ status }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Poppins&display=swap');

.modal {
  position: fixed;
  display: flex;
  inset: 0;
  background-color: rgba(52, 0, 58, 0.7);
}

.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto; /* This magical property centers the element*/
  padding: 5rem;
  padding-top: 4rem;
  width: 1400px;
  height: 700px;
  border-radius: 50px;
  /* background-color: rgba(78, 73, 141, 1); */
  background-image: linear-gradient(
    90deg,
    rgba(78, 73, 141, 1) 3%,
    rgba(84, 49, 128, 1) 45%,
    rgba(61, 53, 156, 1) 100%
  );
  box-shadow: -1px 1px 12px 3px rgba(170, 96, 255, 0.8), 5px 0 0 -1px rgba(0, 238, 255, 0.8),
    20px 0 25px -15px rgba(0, 238, 255, 0.7), inset 0 15px 2px rgba(202, 87, 255, 0.3),
    inset 0 -15px 2px rgba(202, 87, 255, 0.3);
}

.icon {
  /* position: absolute; */
  top: -40px;
}

/* INPUT FORMS */
.form-row1 {
  display: flex;
}

.form-row3 {
  display: flex;
}

.firstname_input,
.lastname_input,
.email_input,
.username_input,
.password_input {
  display: flex;
  flex-direction: column;
  width: 19%;
  padding: 8px;
  padding-left: 20px;
  margin: 10px;
  border-radius: 5px;
  background-color: rgb(112, 102, 206);
}

.firstname_input:hover,
.lastname_input:hover,
.email_input:hover,
.username_input:hover,
.password_input:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
  transition: 0.5s;
  transition-delay: 0.2s;
}

.email_input {
  width: 39.5%;
}

label {
  font-size: x-small;
}

input {
  color: white;
  padding-top: 6px;
  padding-left: 0px;
  font-size: medium;
  border: none;
  background-color: transparent;
}

input:focus {
  outline: none;
}

::placeholder {
  color: lightgray;
}

input:focus::placeholder {
  color: rgb(255, 255, 255, 0.1);
}

/* BUTTONS */
.button-panel {
  display: flex;
  align-items: stretch;
  justify-content: left;
  justify-content: space-between;
  width: 39.5%;
  margin-top: 2%;
  margin-left: 10px;
}

button {
  color: white;
  padding: 2.2% 14%;
  white-space: nowrap;
  border-radius: 4px;
  cursor: pointer;
}

#submitbtn {
  background-color: rgb(243, 109, 78);
  border: none;
  font-family: Poppins;
  font-weight: bold;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19);
  transition: 0.4s;
}

#submitbtn:hover {
  color: rgb(243, 109, 78);
  background-color: white;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
  transition: 0.4s;
}

#cancel {
  padding: 1% 19.5%;
  background-color: rgba(69, 64, 128, 1);
  border: none;
  font-family: Poppins;
  font-weight: bold;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19);
  transition: 0.4s;
}

#cancel:hover {
  color: rgba(69, 64, 128, 1);
  background-color: white;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
  transition: 0.4s;
}

.modal-header {
  margin: 0.7%;
  margin-bottom: 25px;
}

/* START CHATTING NOW! */
.text-start {
  font-size: 16px;
  text-align: left;
  font-family: Poppins;
  font-weight: 600;
}

/* CREATE NEW ACCOUNT */
.text-new-account {
  color: white;
  font-size: 56px;
  text-align: left;
  font-family: Poppins;
  font-weight: 600;
  line-height: normal;
}

/* ALREADY A MEMBER? LOG IN */
.text-member {
  position: fixed;
  margin-left: 10px;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  text-align: left;
  font-family: Poppins;
}

/* TOP LEFT LOGO */
.xmlid320 {
  top: 16px;
  left: 10px;
  /* width: 100px; */ /** This broke after the merge for some reason, I hate CSS */
  scale: 180%;
  height: 102px;
}
.xmlid319 {
  top: 26.569595336914062px;
  left: 0.11193335056304932px;
  width: 11px;
  height: 16px;
  position: absolute;
}
.xmlid318 {
  top: 26.569595336914062px;
  left: 32.511173248291016px;
  width: 11px;
  height: 16px;
  position: absolute;
}
.xmlid317 {
  top: 0px;
  left: 13.789202690124512px;
  width: 16px;
  height: 11px;
  position: absolute;
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
</style>
