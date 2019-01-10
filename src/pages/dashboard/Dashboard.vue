<template>
  <div class="dashboard">
    <el-row :gutter="12">
      <el-col :span="24" class="dashboard-item">
        <h1>原材料统计</h1>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24" class="card-title">
              <h2 class="card-title">原材料数量</h2>
            </el-col>
            <el-col :span="12">
              <span>入库数：{{material.total_num}}</span>
            </el-col>
            <el-col :span="12">
              <span>出库数：{{material.total_left_num}}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24" class="card-title">
              <h2 class="card-title">入库单</h2>
            </el-col>
            <el-col :span="12">
              <span>总数量：{{material.total_num}}</span>
            </el-col>
            <el-col :span="12">
              <span>昨日新增：{{material.total_left_num}}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24" class="card-title">
              <h2 class="card-title">出库单</h2>
            </el-col>
            <el-col :span="12">
              <span>总数量：{{material.total_num}}</span>
            </el-col>
            <el-col :span="12">
              <span>昨日新增：{{material.total_left_num}}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  props: {
    msg: String
  },
  data () {
    return {
      material: {
        total_num: 100,
        total_left_num: 200
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  padding-top: 20px;
  .card-title {
    padding: 5px 0;
  }
  .dashboard-item {
    padding-bottom: 20px;
  }
}
</style>
