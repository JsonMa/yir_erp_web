<template>
  <header>
    <div class="header">
      <el-row>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="rotuteTo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1">首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title">原材料管理</template>
            <el-menu-item index="2-1">原材料管理</el-menu-item>
            <el-menu-item index="2-2">入库单管理</el-menu-item>
            <el-menu-item index="2-3">出库单管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="3" disabled>成品管理</el-menu-item>
          <el-menu-item index="4" disabled>废料管理</el-menu-item>
          <el-menu-item index="5" disabled>订单管理</el-menu-item>
          <el-menu-item index="6" disabled>供应商管理</el-menu-item>
          <el-menu-item index="7" disabled>人员管理</el-menu-item>
        </el-menu>
      </el-row>
      <div class="logout">
        <span class="logout-username">{{user.nick_name || user.tel || '匿名用户'}}</span>
        <span class="logout-welcome">欢迎登录，您的用户类型是</span>
        <span class="logout-roleName">{{user.roleName || '未知'}}</span>
        <el-button type="text" @click="logout">退出登录</el-button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  props: {
    msg: String
  },
  data () {
    return {
      activeIndex: '1'
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    rotuteTo (key, keyPath) {
      switch (key) {
        case '1':
          this.$router.push('/')
          break
        case '2-1':
          this.$router.push('/material')
          break
        case '2-2':
          this.$router.push('/material/entry')
          break
        case '3-3':
          this.$router.push('/material/out')
          break
        case 3:
          this.$router.push('/product')
          break
        case 4:
          this.$router.push('/wasted')
          break
        case 5:
          this.$router.push('/order')
          break
        case 6:
          this.$router.push('/cooperator')
          break
        case 7:
          this.$router.push('/user')
          break
        default:
          this.$router.push('/material')
          break
      }
    },
    logout () {
      this.$axios
        .post('/auth/logout', this.loginForm)
        .then(res => {
          if (res.status === 200) {
            window.localStorage.removeItem('user')
            this.$store.dispatch('user/updateUser', {})
            this.$router.push('/login')
          } else this.$message.error('退出登录失败')
        })
        .catch(() => {
          this.$message.error('接口请求失败')
        })
    }
  }
}
</script>

<style scoped lang="scss">
header {
  background-color: rgb(84, 92, 100);
}
.header {
  margin: 0 auto;
  width: 1200px;
  height: 60px;
  line-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .header-item {
    padding: 10px;
    margin-left: 10px;
  }
  .logout {
    font-size: 14px;
    color: rgb(255, 208, 75);
    .logout-username,
    .logout-roleName {
      margin: 0 10px;
    }
    .el-button--text {
      color: rgb(255, 208, 75);
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
