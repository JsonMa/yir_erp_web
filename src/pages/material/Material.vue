<template>
  <div class="material">
    <div class="searching">
      <el-form :inline="true" :model="searchingForm" class="searching-form">
        <el-form-item>
          <el-date-picker
            v-model="searchingForm.dateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
              v-loading="props.row.showLoading"
            >
              <el-form-item label="序号">
                <span>{{ props.row.index }}</span>
              </el-form-item>
              <el-form-item label="入库单编号">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="材料编号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="材料名称">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="型号">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="厂家">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="单位">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="入库数量">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="入库金额">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="入库日期">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="制单人">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="入库单编号" prop="no"></el-table-column>
        <el-table-column label="材料编号" prop="material.no"></el-table-column>
        <el-table-column label="材料名称" prop="material.name"></el-table-column>
        <el-table-column label="型号" prop="material.model"></el-table-column>
        <el-table-column label="入库数量" prop="real_count"></el-table-column>
        <el-table-column label="入库金额" prop="total_price"></el-table-column>
        <el-table-column label="入库日期" prop="created_at"></el-table-column>
        <el-table-column label="制单人" prop="maker.name" width="80px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-size="1"
        background
        big
        layout="prev, pager, next, jumper"
        :total="100"
        class="paging-item"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Material',
  data () {
    return {
      searchingForm: {
        dateTime: '',
        keyword: ''
      },
      materialEntries: [
        {
          index: 10000,
          no: '入库单序号',
          material: {
            no: '材料序号',
            name: '材料名称',
            model: '材料型号'
          },
          unit: '件',
          real_count: 100,
          total_price: 20000,
          created_at: '2018-12-29T09:25:56.916Z',
          maker: {
            name: '制作者'
          }
        },
        {
          index: 10001,
          no: '入库单序号',
          material: {
            no: '材料序号',
            name: '材料名称',
            model: '材料型号'
          },
          unit: '件',
          real_count: 100,
          total_price: 20000,
          created_at: '2018-12-29T09:25:56.916Z',
          maker: {
            name: '制作者'
          }
        }
      ],
      expandRecord: {} // 记录展开状态
    }
  },
  methods: {
    searching () {
      alert('111')
    }
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
        width: 681px;
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
