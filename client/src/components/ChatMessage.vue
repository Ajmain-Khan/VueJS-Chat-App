<template>
  <article class="tile has-text-left">
    <div class="media-content">
      <div class="content">
        <div>
          <strong>{{ username }}</strong>
          <small> [{{ time }}]</small>
          <br />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ['username', 'message', 'time']
}
</script>

<style>
p,
strong,
small {
  color: black;
}
.tile {
  padding-left: 2px;
  margin: 2px;
  border: 1px solid;
  border-radius: 5px;
}

p,
strong {
  margin: 2px;
  margin-left: 8px;
}
</style>
