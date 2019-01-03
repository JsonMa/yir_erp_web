<template>
  <div class="material">
    <div class="searching">
      <el-form :inline="true" :model="searchingForm" class="searching-form">
        <el-form-item>
          <el-select
            v-model="searchingForm.status"
            placeholder="入库单状态"
            class="materil-entry-status"
          >
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
          <el-input v-model="searchingForm.keyword" placeholder="关键字" class="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searching" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="material-entries">
      <el-table :data="materialEntries" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="厂家：">
                <span>{{ props.row.material.supplier }}</span>
              </el-form-item>
              <el-form-item label="材料编码：">
                <span>{{ props.row.material.no }}</span>
              </el-form-item>
              <el-form-item label="采购员：">
                <span>{{ props.row.buyer.name }}</span>
              </el-form-item>
              <el-form-item label="质检员：">
                <span>{{ props.row.inspector.name }}</span>
              </el-form-item>
              <el-form-item label="质检结果：">
                <span>{{ props.row.quality_result ? '通过' : '不通过' }}</span>
              </el-form-item>
              <el-form-item label="付款方式：">
                <span>{{ props.row.purchase_method }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="入库单编号" prop="no"></el-table-column>
        <el-table-column label="材料名称" prop="material.name"></el-table-column>
        <el-table-column label="型号" prop="material.model"></el-table-column>
        <el-table-column label="入库数量" prop="real_count"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="入库金额" prop="total_price"></el-table-column>
        <el-table-column label="入库日期" prop="created_at"></el-table-column>
        <el-table-column label="制单人" prop="maker.name" width="80px"></el-table-column>
        <el-table-column label="审核状态" prop="status" width="80px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paging" v-if="materialEntries.length">
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
  </div>
</template>

<script>
const moment = require('moment-timezone')
export default {
  name: 'Material',
  data () {
    return {
      searchingForm: {
        dateTime: '',
        keyword: '',
        status: ''
      },
      materialEntries: [],
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
      }
    }
  },

  methods: {
    searching (isNewSearch = true) {
      const { keyword, dateTime, status } = this.searchingForm
      if (isNewSearch) this.page.currentPage = 1
      this.getMaterialEntries({
        status,
        keyword,
        start_time: dateTime[0],
        end_time: dateTime[1]
      })
    },

    handleSizeChange () {},

    handleCurrentChange (currentPage) {
      console.log(currentPage)
      this.page.currentPage = currentPage
      this.searching(false)
    },

    // 数据统一处理函数
    getMaterialEntries (params) {
      const { pageSize, currentPage } = this.page
      const defaultParams = {
        limit: pageSize,
        offset: pageSize * (currentPage - 1)
      }
      this.$axios
        .get('/material_entries', {
          params: Object.assign(defaultParams, params)
        })
        .then(res => {
          const { data, meta } = res.data
          const { currentPage, pageSize } = this.page
          this.materialEntries = data.map((item, index) => {
            item.index = (currentPage - 1) * pageSize + index + 1
            item.no = item.no.split('-')[0]
            item.created_at = moment
              .tz(item.created_at, 'Asia/Shanghai')
              .format('YYYY-MM-DD HH:mm:ss')
            return item
          })
          this.page.total = meta.count
        })
    }
  },

  created () {
    this.getMaterialEntries()
  }
}
</script>

<style lang="scss">
.material {
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
    .materil-entry-status {
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
}
</style>
