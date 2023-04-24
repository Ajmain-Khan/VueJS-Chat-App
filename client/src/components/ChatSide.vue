<template>
  <div @click="open" class="box">
    <h1>{{ contactUsername }}</h1>
    <p style="font-size: 20px">{{ lastMessage }} - {{ lastMessageTime }}</p>
  </div>
</template>

<script>
export default {
  props: {
    contactUsername: String,
    lastMessage: String,
    lastMessageTime: String,
    sortingTime: Date()
  },
  methods: {
    open() {
      this.$emit('open', this.contactUsername)
    }
  }
}
</script>

<style></style>
