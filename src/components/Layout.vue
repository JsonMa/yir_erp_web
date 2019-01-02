<template>
  <div class="warpper">
    <Header></Header>
    <main class="main">
      <router-view/>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'Layout',
  props: {
    msg: String
  },
  components: {
    Footer,
    Header
  }
}
</script>

<style scoped lang="scss">
.warpper {
  width: 100%;
  height: 100%;
}
</style>
