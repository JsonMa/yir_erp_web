<template>
  <div class="material">
    <div class="material-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>原材料管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="material-searching">
      <el-form :inline="true" :model="searchingForm" class="searching-form">
        <el-form-item>
          <el-select
            v-model="searchingForm.categoryId"
            placeholder="材料分类"
            class="materil-entry-status"
          >
            <el-option label="所有" value></el-option>
            <el-option label="未审核" value="UNREVIEW"></el-option>
            <el-option label="通过" value="PASSED"></el-option>
            <el-option label="未通过" value="REJECTED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchingForm.keyword" placeholder="材料名/代号关键字" class="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searching" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openMaterialDialog">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="materials">
      <el-table :data="materials" style="width: 100%">
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="材料编号" prop="no"></el-table-column>
        <el-table-column label="材料名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category.name"></el-table-column>
        <el-table-column label="供应商" prop="supplier.name"></el-table-column>
        <el-table-column label="材料型号" prop="model"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="库存数量" prop="left_count"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="editMaterial(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteMaterial(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="material-paging" v-if="materials.length">
      <el-pagination
        @current-change="jumpingTo"
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
export default {
  name: 'Material',

  data () {
    return {
      searchingForm: {
        keyword: '',
        categoryId: ''
      },
      materials: [
        {
          index: 1,
          no: 'XZ-ADV',
          name: '单端面密封',
          model: '1000*100',
          left_count: 20,
          supplier: { name: '无锡博格曼密封件有限公司' },
          category: { name: '密封' },
          unit: '件'
        }
      ],
      categories: [],
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 1
      },
      currentMaterial: {}
    }
  },

  methods: {
    searching (isNewSearch = true) {
      if (isNewSearch) this.page.currentPage = 1
      this.getMaterials(this.searchingForm)
    },
    jumpingTo (targetPage) {
      this.page.currentPage = targetPage
      this.searching(false)
    },
    getMaterials (params) {
      const { pageSize, currentPage } = this.page
      const moment = this.$moment
      const defaultParams = {
        limit: pageSize,
        offset: pageSize * (currentPage - 1),
        embed: 'material'
      }
      this.$axios
        .get('/materials', {
          params: Object.assign(defaultParams, params)
        })
        .then(res => {
          const { data, meta } = res.data
          const { currentPage, pageSize } = this.page
          this.materials = data.map((item, index) => {
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
    getCategories () {
      // TODO
    },
    printer (targetElement) {
      window.jQuery(targetElement).printThis()
    },
    editMaterial () {},
    deleteMaterial () {},
    openMaterialDialog () {},
    saveMaterial () {}
  },

  created () {
    this.getCategories()
    this.getMaterials()
  }
}
</script>

<style lang="scss">
.material {
  .material-searching {
    .keyword {
      .el-input__inner {
        width: 851px;
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
  .material-paging {
    .paging-item {
      margin-top: 20px;
      text-align: center;
    }
  }
  .material-breadcrumb {
    padding: 20px 0 20px 0;
  }
}
</style>
