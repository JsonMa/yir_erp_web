<template>
  <div class="material-out">
    <el-dialog title="出库单" :visible.sync="visable" @close="close">
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
            <p class="material-out-caption-department">领料部门：{{materialOuts.applicant.department}}</p>
            <p class="material-out-caption-application">领料人：{{materialOuts.applicant.name}}</p>
            <p class="material-out-caption-date">出库单日期：{{materialOuts.cerated_at}}</p>
            <p class="material-out-caption-no">出库单编号：{{materialOuts.no}}</p>
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
          <tr v-for="out in materialOuts.materials" :key="out.index">
            <td>{{out.index}}</td>
            <td>{{out.material.no}}</td>
            <td>{{out.material.name}}</td>
            <td>{{out.material.model}}</td>
            <td>{{out.material.unit}}</td>
            <td>{{out.material.supplier.name}}</td>
            <td>{{out.material.left_count}}</td>
            <td>{{out.material.count}}</td>
            <td>{{out.order}}</td>
            <td>{{out.remark}}</td>
          </tr>
          <tr>
            <td colspan="6">合计：</td>
            <td>{{materialOuts.total_count}}</td>
            <td>{{materialOuts.left_total_count}}</td>
            <td colspan="2"></td>
          </tr>
        </table>
        <div class="material-out-sign">
          <p>制作人：{{materialOuts.maker.name}}</p>
          <p>库管：{{materialOuts.reviewer.name}}</p>
          <p>财务：{{materialOuts.financor.name}}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MaterialOut',
  props: {
    outVisible: Boolean,
    out: Object
  },
  data () {
    return {
      visable: true,
      outDetail: {},
      materialOuts: {
        materials: [
          {
            index: 1,
            material: {
              no: 'XZ-MDE-12',
              name: '双端面密封',
              count: 30,
              left_count: 40,
              unit: '件',
              model: '200x100',
              supplier: {
                name: '江苏海事电机有限公司'
              }
            },
            order: '江西石化煤改气订单',
            remark: '加急'
          }
        ],
        total: 40,
        applicant: {
          department: '生产部',
          name: '马妮妮'
        },
        no: '29183333112932',
        total_count: 40,
        left_total_count: 40,
        cerated_at: '2019-12-11 06:08:22',
        maker: {
          name: '蒋欣'
        },
        reviewer: {
          name: '杜艳'
        },
        financor: {
          name: '谭明'
        }
      }
    }
  },
  watch: {
    outVisible (value) {
      this.visable = value
    },
    out (value) {
      this.outDetail = value
    }
  },
  methods: {
    close () {
      this.$emit('entry-close')
    },
    printer () {
      window.jQuery('.material-out-container').printThis({
        importCSS: true,
        importStyle: true
      })
    }
  }
}
</script>

<style lang="scss">
.material-out {
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
    font-weight: boild;
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
