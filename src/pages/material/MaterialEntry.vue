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
            <el-button size="mini" @click="editEntry(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteEntry(scope.$index, scope.row)">删除</el-button>
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

    <!-- 新增入库单 -->
    <div class="material-entry-add">
      <el-dialog
        :title="materialEntryDialogTitle"
        :visible.sync="showAddDialog"
        width="30%"
        :before-close="closeMaterialEntryForm"
      >
        <el-form
          :model="materialEntryForm"
          ref="materialEntryForm"
          label="采购员"
          label-width="100px"
          class="material-dialog"
          label-position="right"
        >
          <el-form-item label="采购员" :rules="{required: true, message: '采购员不能为空', trigger: 'blur'}">
            <el-select
              v-model="materialEntryForm.buyer"
              filterable
              remote
              reserve-keyword
              placeholder="请输入采购人关键词"
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
          <!-- <el-form-item label="质检员" :rules="{required: true, message: '质检员不能为空', trigger: 'blur'}">
            <el-select
              v-model="materialEntryForm.inspector"
              filterable
              remote
              reserve-keyword
              placeholder="请输入质检员关键词"
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
          </el-form-item>-->
          <el-form-item
            label="入库材料"
            class="entry-material-container"
            :rules="{required: true, message: '入库材料不能为空', trigger: 'blur'}"
          >
            <el-select
              v-model="materialEntryForm.material"
              filterable
              remote
              reserve-keyword
              placeholder="请输入材料关键词"
              :remote-method="queryMaterials"
              :loading="materialLoading"
              class="entry-material entry-form-item"
            >
              <el-option
                v-for="(material, index) in materials"
                :key="index"
                :label="`${material.no}:${material.name}`"
                :value="material._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="付款方式"
            prop="purchase_method"
            :rules="{required: true, message: '付款方式不能为空', trigger: 'blur'}"
          >
            <el-select
              v-model="materialEntryForm.purchase_method"
              filterable
              placeholder="请选择付款方式"
              class="entry-material entry-form-item"
            >
              <el-option
                v-for="(method, index) in purchase_methods"
                :key="index"
                :label="method.name"
                :value="method.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="入库数量"
            prop="application_count"
            :rules="{required: true, message: '入库数量不能为空', trigger: 'blur'}"
          >
            <el-input
              v-model="materialEntryForm.application_count"
              class="applicant-count"
              placeholder="请填写入库数量"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="['ZHIJIAN'].includes(user.role)"
            label="实际数量"
            prop="application_count"
            :rules="{required: true, message: '实际入库数量不能为空', trigger: 'blur'}"
          >
            <el-input
              v-model="materialEntryForm.application_count"
              class="applicant-count"
              placeholder="请填写实际入库数量"
              :disabled="['ZHIJIAN'].includes(user.role)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="材料单价"
            prop="per_price"
            :rules="{required: true, message: '单价不能为空', trigger: 'blur'}"
          >
            <el-input v-model="materialEntryForm.per_price" class="per-price" placeholder="请填写单价"></el-input>
          </el-form-item>
          <el-form-item
            v-if="['ZHIJIAN'].includes(user.role)"
            label="质检结果"
            prop="quality_result"
            :rules="{required: true, message: '质检结果不能为空', trigger: 'blur'}"
          >
            <el-select
              v-model="materialEntryForm.quality_result"
              filterable
              placeholder="请选择质检结果"
              class="entry-material entry-form-item"
            >
              <el-option
                v-for="(result, index) in quality_results"
                :key="index"
                :label="result.name"
                :value="result.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送货人" prop="sender">
            <el-input v-model="materialEntryForm.sender" class="per-price" placeholder="请填写送货人"></el-input>
          </el-form-item>
          <el-form-item label="总价" prop="total_price">
            <el-input v-model="materialEntryForm.total_price" class="total-price" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="materialEntryForm.remark" class="per-price" placeholder="请填写备注信息"></el-input>
          </el-form-item>
          <el-form-item class="out-btn-container">
            <el-button @click="cancleEntrySubmit">取消</el-button>
            <el-button type="primary" @click="submitMaterialEntryForm('materialOutForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
const moment = require('moment-timezone')

export default {
  name: 'MaterialEntry',
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
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
      showAddDialog: false,
      materialEntryDialogTitle: '新增入库单',
      materials: [],
      accounts: [],
      purchase_methods: [
        {
          name: '现金',
          value: 'CASH'
        },
        {
          name: '银行',
          value: 'BANK'
        },
        {
          name: '微信',
          value: 'WECHAT'
        },
        {
          name: '支付宝',
          value: 'ALIPAY'
        }
      ],
      quality_results: [
        {
          name: '通过',
          value: 'true'
        },
        {
          name: '不通过',
          value: 'true'
        },
        {
          name: '部分通过',
          value: 'true'
        }
      ],
      materialEntryForm: {
        material: '',
        application_count: '',
        real_count: '',
        per_price: '',
        total_price: '',
        buyer: '',
        remark: '',
        sender: '',
        maker: '',
        inspector: '',
        quality_result: '',
        purchase_method: ''
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
    addMaterialEntry () {
      this.showAddDialog = true
    },

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
    },

    editEntry (index, row) {},

    deleteEntry (index, row) {
      this.$confirm('此操作将永久删除该入库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .delete(`/material_entries/${row._id}`)
          .then(res => {
            this.$message.success({
              message: '删除入库单成功',
              duration: 1500,
              onClose: () => {
                this.getMaterialEntries()
              }
            })
          })
          .catch(() => {
            this.$message.error('删除入库单接口调用失败')
          })
      })
    },
    closeMaterialEntryForm () {
      this.showAddDialog = false
    },
    submitMaterialEntryForm () {},
    cancleEntrySubmit () {
      this.showAddDialog = false
    }
  },

  created () {
    this.getMaterialEntries()
    this.queryMaterials()
    this.queryAccounts()
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
