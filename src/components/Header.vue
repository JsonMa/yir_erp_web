<template>
  <header class="header">
    <el-row>
      <el-col :span="4">
        <router-link :to="{ name: 'cooperator', params: { userId: 123 }}">供应商管理</router-link>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'material', params: { userId: 123 }}">原材料管理</router-link>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'product', params: { userId: 123 }}">成品管理</router-link>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'wasted', params: { userId: 123 }}">废料管理</router-link>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'order', params: { userId: 123 }}">订单管理</router-link>
      </el-col>
      <el-col :span="4">
        <router-link :to="{ name: 'user', params: { userId: 123 }}">人员管理</router-link>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 80px;
  line-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
