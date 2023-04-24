<template>
  <div>
    <div class="container">
      <h1>Sign Up</h1>
      <hr />

      <label for="fname"><b>First Name</b></label>
      <input v-model="firstname" type="text" placeholder="first name" name="fname" required />
      <br />

      <label for="lname"><b>Last Name</b></label>
      <input v-model="lastname" type="text" placeholder="last name" name="lname" required />
      <br />

      <label for="fname"><b>Username</b></label>
      <input v-model="username" type="text" placeholder="username" name="fname" required />
      <br />

      <label for="email"><b>Email</b></label>
      <input v-model="email" type="text" placeholder="Enter Email" name="email" required />
      <br />

      <label for="psw"><b>Password</b></label>
      <input v-model="password" type="password" placeholder="Enter Password" name="psw" required />
      <br />

      <div>
        <button class="button" @click="signup">Sign Up</button>
      </div>
    </div>

    <div v-if="accepted">
      <h1>{{ status }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstname: 'a',
      lastname: 'a',
      username: 'lucasrocha1',
      email: 'a',
      password: 'a',
      accepted: false,
      status: ''
    }
  },
  methods: {
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
  }
}
</script>

<style></style>
