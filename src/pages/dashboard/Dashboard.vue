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
              <span>入库数：</span>
              <span>
                <router-link
                  :to="{ name: 'materialEntry', params: {
                    start_time: this.startTime,
                    end_time: this.endTime
                  }}"
                >{{material.entryNumber}}</router-link>
              </span>
            </el-col>
            <el-col :span="12">
              <span>出库数：</span>
              <span>
                <router-link
                  :to="{ name: 'materialOut', params: {
                    start_time: this.startTime,
                    end_time: this.endTime
                  }}"
                >{{material.outNumber}}</router-link>
              </span>
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
              <span>总数量：{{materialEntries.allCount}}</span>
            </el-col>
            <el-col :span="12">
              <span>昨日新增：</span>
              <span>
                <router-link
                  :to="{ name: 'materialEntry', params: {
                    start_time: this.startTime,
                    end_time: this.endTime
                  }}"
                >{{materialEntries.count}}</router-link>
              </span>
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
              <span>总数量：{{materialOuts.allCount}}</span>
            </el-col>
            <el-col :span="12">
              <span>昨日新增：</span>
              <span>
                <router-link
                  :to="{ name: 'materialOut', params: {
                    start_time: this.startTime,
                    end_time: this.endTime
                  }}"
                >{{materialOuts.count}}</router-link>
              </span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const moment = require('moment-timezone')

export default {
  name: 'Dashboard',
  props: {
    msg: String
  },
  data () {
    return {
      material: {
        entryNumber: 0,
        outNumber: 0
      },
      startTime: new Date(moment().startOf('day') - 10 * 24 * 3600 * 1000),
      endTime: new Date(moment().startOf('day')),
      materialEntries: {
        allCount: 0,
        count: 0
      },
      materialOuts: {
        allCount: 0,
        count: 0
      }
    }
  },
  methods: {
    getMaterialOuts () {
      this.$axios
        .get('/material_entries', {
          params: {
            limit: 100000,
            offset: 0,
            embed: 'material',
            start_time: this.startTime,
            end_time: this.endTime,
            queryAll: true
          }
        })
        .then(res => {
          const { data, meta } = res.data
          data.forEach(item => {
            this.material.entryNumber += item.real_count
          })
          this.materialEntries = meta
        })
    },
    getMaterialEntrys () {
      this.$axios
        .get('/material_outs', {
          params: {
            limit: 100000,
            offset: 0,
            embed: 'material',
            start_time: this.startTime,
            end_time: this.endTime,
            queryAll: true
          }
        })
        .then(res => {
          const { data, meta } = res.data
          data.forEach(item => {
            item.materials.forEach(material => {
              this.material.outNumber += material.count
            })
          })
          this.materialOuts = meta
        })
    }
  },
  created () {
    this.getMaterialOuts()
    this.getMaterialEntrys()
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
