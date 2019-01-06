<template>
  <div class="warpper">
    <Header v-if="hederVisable"></Header>
    <main class="main">
      <router-view/>
    </main>
    <Footer v-if="footerVisable"></Footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'Layout',
  components: {
    Footer,
    Header
  },
  data () {
    return {
      hederVisable: false,
      footerVisable: false
    }
  }
}
</script>

<style scoped lang="scss">
.warpper {
  width: 100%;
  height: 100%;
  .main {
    margin: 0 auto;
    width: 1200px;
    height: calc(100% - 160px);
  }
}
</style>
