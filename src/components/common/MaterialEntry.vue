<template>
  <div class="material-entry">
    <el-dialog title="入库单" :visible.sync="visable" @close="close">
      <el-row class="entry-printer">
        <el-button type="primary" size="small" @click="printEntry">打印</el-button>
      </el-row>
      <div class="entry-remark">
        <span class="entry-item-title">一式四联，1库房2财务3采购员4质检</span>
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
            <span class="entry-item-title">材料供应商：</span>
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
          <td>{{entryDetail.application_count}}</td>
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MaterialEntry',
  props: {
    entryVisible: Boolean,
    entry: Object
  },
  data () {
    return {
      visable: true,
      entryDetail: {}
    }
  },
  watch: {
    entryVisible (value) {
      this.visable = value
    },
    entry (value) {
      this.entryDetail = value
    }
  },
  methods: {
    close () {
      this.$emit('entry-close')
    },
    printEntry () {
      alert('打印机')
    }
  }
}
</script>

<style lang="scss">
.entry-item {
  padding-bottom: 10px;
}
.material-entry {
  .el-dialog__body {
    padding: 0px 20px 70px 20px;
  }
  .entry-printer {
    padding: 10px 0;
    text-align: right;
  }
  .entry-remark {
    margin: 10px 0;
    text-align: center;
    .remark {
      color: red;
    }
  }
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
</style>
