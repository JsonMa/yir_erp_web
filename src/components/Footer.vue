<template>
  <footer class="header">这是底部</footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
footer {
  height: 100px;
  background-color: #545c64;
}
</style>
