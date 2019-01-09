<template>
  <div class="material-out">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/material' }">原材料管理</el-breadcrumb-item>
        <el-breadcrumb-item>出库单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="searching">
      <el-form :inline="true" :model="searchingForm" class="searching-form">
        <el-form-item>
          <el-select v-model="searchingForm.status" placeholder="出库单状态" class="materil-out-status">
            <el-option label="所有" value></el-option>
            <el-option label="未审核" value="UNREVIEW"></el-option>
            <el-option label="通过" value="PASSED"></el-option>
            <el-option label="未通过" value="REJECTED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchingForm.dateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="dateTimeOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchingForm.keyword" placeholder="出库单关键字" class="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searching" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="material-outs">
      <el-table :data="materialOuts" style="width: 100%" @row-click="showDetail">
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="出库单编号" prop="no"></el-table-column>
        <el-table-column label="原因" prop="reason"></el-table-column>
        <el-table-column label="总数量" prop="total_count"></el-table-column>
        <el-table-column label="制作者" prop="maker.name"></el-table-column>
        <el-table-column label="申请者" prop="applicant.name"></el-table-column>
        <el-table-column label="审核状态" prop="status"></el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="80px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging" v-if="materialOuts.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        background
        big
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        class="paging-item"
      ></el-pagination>
    </div>

    <!-- <MaterialOut :out-visible="outVisable" :out="currentOut" @out-close="outClose"></MaterialOut> -->
  </div>
</template>

<script>
// import MaterialOut from '@/components/common/MaterialOut.vue';

const moment = require('moment-timezone')

export default {
  name: 'MaterialOut',

  components: {
    // MaterialOut
  },

  data () {
    return {
      searchingForm: {
        dateTime: '',
        keyword: '',
        status: ''
      },
      materialOuts: [],
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 0
      },
      dateTimeOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date()
              const start = new Date(moment().format('YYYY-MM-DD'))
              start.setTime(start.getTime() - 3600 * 1000 * 8)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      currentOut: {},
      outVisable: false
    }
  },

  methods: {
    searching (isNewSearch = true) {
      const { keyword, dateTime, status } = this.searchingForm
      if (isNewSearch) this.page.currentPage = 1
      this.getMaterialOuts({
        status,
        keyword,
        start_time: dateTime[0],
        end_time: dateTime[1]
      })
    },

    // 打开出库单详情
    showDetail (row) {
      this.outVisable = true
      this.currentOut = row
    },

    // 关闭出库详情
    outClose () {
      this.outVisable = false
    },

    handleSizeChange () {},

    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.searching(false)
    },

    // 数据统一处理函数
    getMaterialOuts (params) {
      const { pageSize, currentPage } = this.page
      const defaultParams = {
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
        embed: 'material'
      }
      this.$axios
        .get('/material_outs', {
          params: Object.assign(defaultParams, params)
        })
        .then(res => {
          const { data, meta } = res.data
          const { currentPage, pageSize } = this.page
          this.materialOuts = data.map((item, index) => {
            item.index = (currentPage - 1) * pageSize + index + 1
            item.no = item.no.split('-')[0]
            item.created_at = moment
              .tz(item.created_at, 'Asia/Shanghai')
              .format('YYYY-MM-DD HH:mm:ss')
            return item
          })
          this.page.total = meta.count
        })
        .catch(() => {
          this.$message.error('出库单列表获取失败')
        })
    },
    printer (targetElement) {
      window.jQuery(targetElement).printThis()
    }
  },

  created () {
    this.getMaterialOuts()
  }
}
</script>

<style lang="scss">
.material-out {
  .table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .searching {
    padding-top: 20px;
    .keyword {
      .el-input__inner {
        width: 454px;
      }
    }
    .materil-out-status {
      .el-input--suffix {
        .el-input__inner {
          width: 150px;
        }
      }
    }
  }
  .paging {
    .paging-item {
      margin-top: 20px;
      text-align: center;
    }
  }
  .breadcrumb {
    padding: 20px 0 0 0;
  }
}
</style>
