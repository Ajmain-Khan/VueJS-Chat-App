<script>
import { RouterLink, RouterView } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'
import RegistrationModal from '../components/RegistrationModal.vue'
import { ref } from 'vue'

export default {
  components: {
    LoginModal,
    RegistrationModal
  },
  setup(props) {
    const loginModalActive = ref(false)
    const registrationModalActive = ref(false)

    const toggleLoginModal = () => {
      loginModalActive.value = !loginModalActive.value
    }
    const toggleRegistrationModal = () => {
      registrationModalActive.value = !registrationModalActive.value
    }

    return { loginModalActive, toggleLoginModal, registrationModalActive, toggleRegistrationModal }
  }
}
</script>

<template>
  <main>
    <div class="header">
      <p class="title">Rizz Chat</p>
      <p>Welcome to Rizz Chat!</p>
      <p>Chat with your friends and stay connected!</p>
    </div>

    <div class="nav-buttons">
      <div class="login-button" @click="toggleLoginModal">
        <img src="@/assets/login.png" alt="Log-in" />
      </div>
      <div class="register-button" @click="toggleRegistrationModal">
        <img alt="Register" class="logo" src="@/assets/registerbutton.png" />
      </div>
    </div>
  </main>
  <LoginModal :loginModalActive="loginModalActive" @close="toggleLoginModal" />
  <RegistrationModal
    :registrationModalActive="registrationModalActive"
    @close="toggleRegistrationModal"
  />
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Script MT Bold';
  font-size: 135px;
  text-align: center;
}

.header {
  margin: 5%;
  flex-direction: column;
}

.title {
  color: white;
  font-size: 135px;
  bottom: 100px;
  text-shadow: 11px 11px 14px rgba(0, 0, 0, 0.5);
}

main p:nth-child(2) {
  bottom: 55px;
  font-family: Arial;
  font-size: 25px;
}

main p:nth-child(3) {
  bottom: 45px;
  font-family: Arial;
  font-size: 20px;
}

.nav-buttons {
  display: flex;
}

.login-button img,
.register-button img {
  cursor: pointer;
  width: 350px;
  height: 350px;
}

.login-button {
  margin-right: 100px;
  transition: transform 0.3s ease-out; /* added transition property */
}

.login-button:hover {
  transform: scale(1.15); /* added hover effect */
}
.register-button {
  margin-left: 100px;
  transition: transform 0.3s ease-out; /* added transition property */
}

.register-button:hover {
  transform: scale(1.15); /* added hover effect */
}
</style>
