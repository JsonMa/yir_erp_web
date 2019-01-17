<template>
  <div class="material-entry">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/material' }">原材料管理</el-breadcrumb-item>
        <el-breadcrumb-item>入库单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索条件 -->
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
          <el-input v-model="searchingForm.keyword" placeholder="入库单关键字" class="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searching" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMaterialEntry">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="material-entries">
      <el-table :data="materialEntries" style="width: 100%" @row-click="showDetail">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="厂家：">
                <span>{{ props.row.material.name }}</span>
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
        <el-table-column label="单位" prop="material.unit"></el-table-column>
        <el-table-column label="总金额" prop="total_price"></el-table-column>
        <el-table-column label="入库日期" prop="created_at"></el-table-column>
        <el-table-column label="审核状态" prop="status" width="80px"></el-table-column>
        <el-table-column label="详情" width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
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

    <!-- 入库单详情 -->
    <div class="material-entry-detail">
      <el-dialog title="入库单" :visible.sync="detailVisable" @close="closeEntry" v-if="entryDetail">
        <el-row class="entry-printer">
          <el-button type="primary" size="small" @click="printer">打印</el-button>
        </el-row>
        <div class="entry-detail-container">
          <div class="entry-remark">
            <h2 class="entry-remark-title">入库单</h2>
            <span class="entry-remark-item">一式四联，1库房2财务3采购员4质检</span>
          </div>
          <table class="entry-table" border="1">
            <tr>
              <th rowspan="2" colspan="2">材料入库单</th>
              <td colspan="2">
                <span class="entry-item-title">入库单编号：</span>
                {{entryDetail.no}}
              </td>
              <td colspan="2">
                <span class="entry-item-title">入库日期：</span>
                {{entryDetail.created_at}}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span class="entry-item-title">供应商：</span>
                {{entryDetail.material && entryDetail.material.supplier && entryDetail.material.supplier.name || '无'}}
              </td>
              <td colspan="2">
                <span class="entry-item-title">送货人：</span>
                {{entryDetail.sender || '无'}}
              </td>
            </tr>
            <tr>
              <th rowspan="3" colspan="2">
                <p class="entry-item">{{entryDetail.material.no}}</p>
                <p class="entry-item">{{entryDetail.material.name}}</p>
                <p class="entry-item">{{entryDetail.remark}}</p>
              </th>
              <td>
                <span class="entry-item-title">材料型号</span>
              </td>
              <td>{{entryDetail.material.model || '无'}}</td>
              <td>
                <span class="entry-item-title">材料规格</span>
              </td>
              <td>{{entryDetail.material.specific || '无'}}</td>
            </tr>
            <tr>
              <td>
                <span class="entry-item-title">检验数量</span>
              </td>
              <td>
                {{entryDetail.application_count}}
                {{entryDetail.unit}}
              </td>
              <td>
                <span class="entry-item-title">质检结果</span>
              </td>
              <td>{{entryDetail.quality_result ? '合格':'不合格'}}</td>
            </tr>
            <tr>
              <td>
                <span class="entry-item-title">实际入库数</span>
              </td>
              <td>
                {{entryDetail.real_count}}
                {{entryDetail.unit}}
              </td>
              <td>
                <span class="entry-item-title">单价</span>
              </td>
              <td>{{entryDetail.per_price}} / {{entryDetail.unit}}</td>
            </tr>
            <tr>
              <td>
                <span class="entry-item-title">制单人：</span>
                {{entryDetail.maker.name}}
              </td>
              <td>
                <span class="entry-item-title">购买人：</span>
                {{entryDetail.buyer.name}}
              </td>
              <td>
                <span class="entry-item-title">检验人：</span>
                {{entryDetail.inspector.name}}
              </td>
              <td>
                <span class="entry-item-title">审核人：</span>
                {{entryDetail.reviewer.name}}
              </td>
              <td colspan="2" style="text-align: center; padding-right: 40px">
                <span class="entry-item-title">总价：</span>
                {{entryDetail.real_count * entryDetail.per_price}}
                元
              </td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const moment = require('moment-timezone')

export default {
  name: 'MaterialEntry',

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
        pageSize: 10,
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
      entryDetail: '',
      detailVisable: false,
      materialLoading: false,
      accountLoading: false,
      materials: [],
      accounts: []
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
    addMaterialEntry () {},

    // 关闭entry详情
    entryClose () {
      this.entryVisable = false
    },

    handleSizeChange () {},

    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.searching(false)
    },

    // 数据统一处理函数
    getMaterialEntries (params) {
      const { pageSize, currentPage } = this.page
      const defaultParams = {
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
        embed: 'material'
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
    },

    queryMaterials (keyword) {
      this.materialLoading = true
      const defaultParams = {
        limit: 1000,
        offset: 0,
        embed: 'material',
        keyword
      }
      this.$axios
        .get('/materials', {
          params: Object.assign(defaultParams)
        })
        .then(res => {
          const { data } = res.data
          const { currentPage, pageSize } = this.page
          this.materials = data.map((item, index) => {
            item.index = (currentPage - 1) * pageSize + index + 1
            item.no = item.no.split('-')[0]
            return item
          })
          this.materialLoading = false
        })
        .catch(() => {
          this.$message.error('原材料接口调用失败')
        })
    },

    queryAccounts (keyword) {
      this.accountLoading = true
      const defaultParams = {
        limit: 1000,
        offset: 0,
        keyword
      }
      this.$axios
        .get('/accounts', {
          params: Object.assign(defaultParams)
        })
        .then(res => {
          const { data } = res.data
          this.accounts = data
          this.accountLoading = false
        })
        .catch(() => {
          this.$message.error('用户接口调用失败')
        })
    },
    closeEntry () {},
    printer () {
      window.jQuery('.entry-detail-container').printThis({
        importCSS: true,
        importStyle: true
      })
    },
    showDetail (row) {
      this.entryDetail = row
      this.detailVisable = true
    }
  },

  created () {
    this.getMaterialEntries()
  }
}
</script>

<style lang="scss">
.material-entry {
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
        width: 441px;
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
    padding: 20px 0;
    .paging-item {
      text-align: center;
    }
  }
  .breadcrumb {
    padding: 20px 0 0 0;
  }

  .material-entry-detail {
    .el-dialog__body {
      padding: 0px 20px 70px 20px;
    }
    .entry-printer {
      padding: 10px 0;
      text-align: right;
    }
  }
}
.entry-detail-container {
  text-align: center;
  .entry-remark {
    margin: 10px 0;
    text-align: center;
    .entry-remark-title {
      font-size: 24px;
      padding: 10px 0;
    }
    .remark {
      color: red;
    }
  }
  .entry-item {
    padding-bottom: 10px;
  }
  .entry-table {
    min-width: 920px;
    border: 1px solid silver;
    td,
    th {
      padding: 10px;
      width: 150px;
    }
    .entry-item-title {
      font-weight: bold;
    }
  }
}
</style>
