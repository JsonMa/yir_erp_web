<template>
  <div class="warpper">
    <Header v-if="!isLogin"></Header>
    <main class="main" :class="[isLogin ? loginMain: '']">
      <router-view/>
    </main>
    <Footer v-if="!isLogin"></Footer>
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
      isLogin: true,
      loginMain: 'login-main'
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
  .login-main {
    height: 100%;
  }
}
</style>
