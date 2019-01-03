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
          <el-menu-item index="1">原材料管理</el-menu-item>
          <el-menu-item index="2" disabled>成品管理</el-menu-item>
          <el-menu-item index="3" disabled>废料管理</el-menu-item>
          <el-menu-item index="4" disabled>订单管理</el-menu-item>
          <el-menu-item index="5" disabled>供应商管理</el-menu-item>
          <el-menu-item index="6" disabled>人员管理</el-menu-item>
        </el-menu>
      </el-row>
    </div>
  </header>
</template>

<script>
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
  methods: {
    rotuteTo (key, keyPath) {
      switch (key) {
        case 1:
          this.$router.push('material')
          break
        case 2:
          this.$router.push('product')
          break
        case 3:
          this.$router.push('wasted')
          break
        case 4:
          this.$router.push('order')
          break
        case 5:
          this.$router.push('cooperator')
          break
        case 6:
          this.$router.push('user')
          break
        default:
          this.$router.push('material')
          break
      }
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
}
</style>
