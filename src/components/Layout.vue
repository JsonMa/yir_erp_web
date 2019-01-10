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
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Footer,
    Header
  },
  data () {
    return {
      isLogin: false,
      loginMain: 'login-main'
    }
  },
  computed: {
    ...mapGetters({
      navigator: 'navigator/navigator'
    })
  },
  watch: {
    navigator (value) {
      this.isLogin = value === '/login'
    }
  },
  created () {
    this.isLogin = this.$route.path === '/login'
    const user = window.localStorage.getItem('user')
    if (user) this.$store.dispatch('user/updateUser', JSON.parse(user))
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
    min-height: calc(100% - 160px);
  }
  .login-main {
    height: 100%;
  }
}
</style>
