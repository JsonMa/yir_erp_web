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
        <el-form-item>
          <el-button type="primary" @click="addMaterialOut">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="material-outs">
      <el-table :data="materialOuts" style="width: 100%" :loading="tableLoading">
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="出库单编号" prop="no" width="100px"></el-table-column>
        <el-table-column label="申请者" prop="applicant.name" width="80px"></el-table-column>
        <el-table-column label="原因" prop="reason" width="80px"></el-table-column>
        <el-table-column label="总数量" prop="total_count" width="80px"></el-table-column>
        <el-table-column label="制作者" prop="maker.name" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="showDetail(scope.row)" type="text">查看出库单详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'UNREVIEW' && ['CAIWU','ADMIN'].includes(user.role)">
              <el-button size="mini" @click="reviewOut(scope.row, 'PASSED')">通过</el-button>
              <el-button size="mini" type="danger" @click="reviewOut(scope.row, 'REJECTED')">驳回</el-button>
            </div>
            <span v-if="scope.row.status === 'UNREVIEW'">未审核</span>
            <span v-else>{{scope.row.status === 'PASSED' ? '已通过' : '审核不通过'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editOut(scope.row)"
              v-if="['UNREVIEW', 'REJECTED'].includes(scope.row.status)"
            >{{scope.row.status === 'UNREVIEW' ? '修改': '重新提交'}}</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="user.role === 'ADMIN'"
              @click="deleteOut(scope.$index, scope.row, event)"
            >删除</el-button>
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

    <!-- 材料出库单详情 -->
    <div class="material-out-detail">
      <el-dialog title="出库单" :visible.sync="outVisiable" @close="outClose">
        <el-row class="material-out-printer">
          <el-button type="primary" size="small" @click="printer">打印</el-button>
        </el-row>
        <div class="material-out-container">
          <div class="material-out-remark">
            <h2 class="material-out-remark-title">出库单</h2>
            <p class="material-out-remark-subtitle">一式三联，1库房2财务3领料人</p>
          </div>
          <div class="material-out-caption">
            <div class="material-out-caption">
              <p
                class="material-out-caption-department"
              >领料部门：{{currentOut.applicant.department ? currentOut.applicant.department.name :''}}</p>
              <p class="material-out-caption-application">领料人：{{currentOut.applicant.name}}</p>
              <p class="material-out-caption-date">出库单日期：{{currentOut.created_at}}</p>
              <p class="material-out-caption-no">出库单编号：{{currentOut.no}}</p>
            </div>
          </div>
          <table class="material-out-table" border="1">
            <tr>
              <th class="material-out-item-smaller">序号</th>
              <th class="material-out-item-middle">材料编码</th>
              <th class="material-out-item-middle">材料名称</th>
              <th class="material-out-item-middle">规格型号</th>
              <th class="material-out-item-smaller">单位</th>
              <th class="material-out-item-middle">厂家</th>
              <th class="material-out-item-smaller">库存数</th>
              <th class="material-out-item-smaller">出库数</th>
              <th class="material-out-item-middle">用途</th>
              <th class="material-out-item-middle">备注</th>
            </tr>
            <tr v-for="out in currentOut.materials" :key="out.index">
              <td>{{out.index}}</td>
              <td>{{out.material.no}}</td>
              <td>{{out.material.name}}</td>
              <td>{{out.material.model}}</td>
              <td>{{out.material.unit}}</td>
              <td>{{out.material.supplier.name}}</td>
              <td>{{out.left_count || out.material.left_num}}</td>
              <td>{{out.count}}</td>
              <td>{{out.order || '无'}}</td>
              <td>{{out.remark || '无'}}</td>
            </tr>
            <tr>
              <td colspan="6">合计：</td>
              <td>{{currentOut.totalLeft}}</td>
              <td>{{currentOut.total_count}}</td>
              <td colspan="2"></td>
            </tr>
          </table>
          <div class="material-out-sign">
            <p>制作人：{{currentOut.maker.name}}</p>
            <p>库管：{{currentOut.reviewer ? currentOut.reviewer.name : '无'}}</p>
            <p>财务：{{currentOut.financor ? currentOut.financor.name : '无'}}</p>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 新增出库单 -->
    <div class="material-out-add">
      <el-dialog
        :title="materialOutDialogTitle"
        :visible.sync="showAddDialog"
        width="30%"
        :before-close="closeMaterialOutForm"
      >
        <el-form
          :model="materialOutForm"
          ref="materialOutForm"
          label-width="100px"
          class="material-dialog"
          label-position="right"
        >
          <el-form-item label="申请人" :rules="{required: true, message: '领料人不能为空', trigger: 'blur'}">
            <el-select
              v-model="materialOutForm.applicant"
              filterable
              remote
              reserve-keyword
              placeholder="请输入领料人关键词"
              :remote-method="queryAccounts"
              :loading="accountLoading"
              class="out-applicant"
            >
              <el-option
                v-for="(account, index) in accounts"
                :key="index"
                :label="`${account.department.name}:${account.name}`"
                :value="account._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原因" :rules="{required: true, message: '材料用途不能为空', trigger: 'blur'}">
            <el-input v-model="materialOutForm.reason" class="out-reason" placeholder="请输入材料用途"></el-input>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in materialOutForm.materials"
            :label="`材料${index + 1}`"
            :key="index"
            class="out-material-container"
            :rules="{required: true, message: '材料信息不能为空', trigger: 'blur'}"
          >
            <el-select
              v-model="item.material"
              filterable
              remote
              reserve-keyword
              placeholder="请输入材料关键词"
              :remote-method="queryMaterials"
              :loading="loading"
              class="out-material out-form-item"
            >
              <el-option
                v-for="(material, index) in materials"
                :key="index"
                :label="`${material.no}:${material.name}`"
                :value="material._id"
              ></el-option>
            </el-select>
            <el-input
              class="out-count out-form-item"
              v-model="item.count"
              placeholder="申请数量"
              @blur="changeTotalCount(item)"
            ></el-input>
            <el-input class="out-order out-form-item" v-model="item.order" placeholder="用于订单"></el-input>
            <el-input class="out-remark out-form-item" v-model="item.remark" placeholder="备注"></el-input>
            <el-button @click.prevent="removeMaterial(item)">删除</el-button>
          </el-form-item>
          <el-form-item label="总数" prop="reason">
            <el-input v-model="materialOutForm.total_count" disabled class="out-total-count"></el-input>
          </el-form-item>
          <el-form-item class="out-btn-container">
            <el-button @click="addMaterial">新增材料</el-button>
            <el-button @click="cancleOutSubmit">取消</el-button>
            <el-button type="primary" @click="submitMaterialOutForm('materialOutForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const moment = require('moment-timezone')
const _ = require('underscore')

export default {
  name: 'MaterialOut',

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
      currentOut: {
        materials: [
          {
            index: 1,
            material: {
              no: '',
              name: '',
              count: 0,
              left_count: 0,
              unit: '',
              model: '',
              supplier: {
                name: ''
              }
            },
            order: '',
            remark: ''
          }
        ],
        total: 0,
        applicant: {
          department: '',
          name: ''
        },
        no: '',
        total_count: 0,
        left_total_count: 0,
        cerated_at: '',
        maker: {
          name: ''
        },
        reviewer: {
          name: ''
        }
      },
      outVisiable: false,
      showAddDialog: false,
      materialOutForm: {
        reason: '',
        total_count: 0,
        applicant: '',
        materials: [
          {
            material: '',
            count: '',
            remark: '',
            order: ''
          }
        ]
      },
      materials: [],
      accounts: [],
      loading: false,
      tableLoading: false,
      accountLoading: false,
      materialOutDialogTitle: '',
      isOutUpdate: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'user/user'
    })
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
      let totalLeft = 0
      row.materials.forEach((item, index) => {
        item.index = index + 1
        const left = item.left_count || item.material.left_num
        totalLeft += left
      })
      row.totalLeft = totalLeft
      this.outVisiable = true
      this.currentOut = row
    },

    outClose () {
      this.outVisiable = false
    },

    handleSizeChange () {},

    handleCurrentChange (currentPage) {
      this.page.currentPage = currentPage
      this.searching(false)
    },

    // 数据统一处理函数
    getMaterialOuts (params) {
      this.tableLoading = true
      const { pageSize, currentPage } = this.page
      const defaultParams = {
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
        embed: 'material,department'
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
          this.tableLoading = false
        })
        .catch(() => {
          this.$message.error('出库单列表获取失败')
          this.tableLoading = false
        })
    },
    printer () {
      window.jQuery('.material-out-container').printThis({
        debug: false,
        importCSS: true,
        importStyle: true
      })
    },
    addMaterialOut () {
      this.materialOutDialogTitle = '新增材料出库单';
      this.showAddDialog = true
      this.isOutUpdate = false
    },
    closeMaterialOutForm () {
      this.showAddDialog = false
    },
    submitMaterialOutForm (form) {
      let url = '/material_outs';
      let method = 'post';
      const formData = this[form]
      if (!formData.maker) {
        formData.maker = this.user._id
      }

      if (this.isOutUpdate) {
        url = `/material_outs/${formData._id}`
        method = 'patch';
        formData.materials.forEach(item => {
          if (typeof item.material === 'object') {
            item.material = item.material._id
          }
        })
        if (typeof formData.maker === 'object') {
          formData.maker = formData.maker._id
        }
        if (typeof formData.applicant === 'object') {
          formData.applicant = formData.applicant._id
        }
        if (formData.status === 'REJECTED') formData.status = 'UNREVIEW';

        delete formData.index
        delete formData.created_at
        delete formData.updated_at
        delete formData.__v
        delete formData.no
        delete formData._id
        delete formData.totalLeft
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$axios
            .request({
              url,
              method,
              data: formData
            })
            .then(res => {
              // 刷新列表
              this.$message.success({
                message: this.isOutUpdate
                  ? '修改材料出库单成功'
                  : '新增材料出库单成功',
                duration: 1500,
                onClose: () => {}
              })
              this.getMaterialOuts()
              this.showAddDialog = false
            })
            .catch(err => {
              if (err.request && err.request.status === 400) {
                this.$message.error('参数错误')
              } else this.$message.error('接口请求失败')
              this.showAddDialog = false
            })
        } else {
          return false
        }
      })
    },
    cancleOutSubmit () {
      this.showAddDialog = false
    },
    queryMaterials (keyword) {
      this.loading = true
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
          this.loading = false
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
    addMaterial () {
      this.materialOutForm.materials.push({
        material: '',
        count: '',
        remark: '',
        order: ''
      })
    },
    removeMaterial (materil) {
      const index = this.materialOutForm.materials.indexOf(materil)
      if (index !== -1) {
        this.materialOutForm.materials.splice(index, 1)
      }
    },
    changeTotalCount (item) {
      if (item && item.count && _.isNumber(parseInt(item.count))) {
        this.materialOutForm.total_count = 0
        this.materialOutForm.materials.forEach(material => {
          this.materialOutForm.total_count += parseInt(material.count)
        })
      }
    },
    deleteOut (index, row, event) {
      this.$confirm('此操作将永久删除该出库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(`/material_outs/${row._id}`)
            .then(res => {
              this.$message.success({
                message: '删除出库单成功',
                duration: 1500,
                onClose: () => {
                  this.showDialog = false
                  this.getMaterialOuts()
                }
              })
            })
            .catch(() => {
              this.$message.error('删除出库单接口调用失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editOut (row, status) {
      this.showAddDialog = true
      this.materialOutDialogTitle = '修改材料出库单';
      this.isOutUpdate = true
      this.materialOutForm = _.clone(row)
    },
    reviewOut (row, status) {
      if (status) this.materialOutForm.status = status
      this.$axios
        .request({
          url: `/material_outs/${row._id}`,
          method: 'patch',
          data: {
            status
          }
        })
        .then(res => {
          this.$message.success({
            message: '修改审核状态成功',
            duration: 1500,
            onClose: () => {}
          })
        })
        .catch(err => {
          if (err.request && err.request.status === 400) {
            this.$message.error('参数错误')
          } else this.$message.error('接口请求失败')
        })
    }
  },

  created () {
    this.getMaterialOuts()
    this.queryAccounts()
    this.queryMaterials()
  }
}
</script>

<style lang="scss" scope>
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
        width: 441px;
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

  .out-material-container {
    .el-form-item__content {
      width: 400px;
    }
    .out-count,
    .out-remark,
    .out-order {
      width: 160px;
      padding: 5px 10px;
    }
    .out-order {
      padding-left: 0;
    }
    .out-count {
      width: 183px;
    }
  }
  .out-reason,
  .out-applicant,
  .out-total-count {
    width: 390px;
  }
}

// 出库单详情
.material-out-detail {
  .el-dialog {
    min-width: 960px;
  }
  .el-dialog__body {
    padding: 0px 20px 70px 20px;
  }
  .material-out-printer {
    padding: 10px 0 0 0;
    text-align: right;
  }
}
.material-out-container {
  text-align: center;
  .material-out-remark {
    margin: 10px 0;
    .material-out-remark-title {
      font-size: 24px;
      padding: 10px 0;
    }
  }
  .material-out-caption {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    p {
      margin-right: 10px;
      text-align: left;
    }
    .material-out-caption-department {
      width: 165px;
    }
    .material-out-caption-application {
      width: 150px;
    }
    .material-out-caption-date {
      width: 285px;
    }
    .material-out-caption-no {
      width: 260px;
    }
  }
  .material-out-table {
    td,
    th {
      padding: 10px 5px;
      text-align: center;
    }
    .material-out-item-smaller {
      width: 50px;
    }
    .material-out-item-middle {
      width: 100px;
    }
    min-width: 920px;
    border: 1px solid silver;
    .material-out-item-title {
      font-weight: bold;
    }
  }
  .material-out-sign {
    padding-top: 15px;
    width: 80%;
    margin: 0 auto;
    p {
      width: 33%;
      display: inline-block;
    }
  }
}
</style>
