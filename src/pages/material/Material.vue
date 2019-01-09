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
            <el-option
              :label="category.name"
              :value="category._id"
              v-for="category in categories"
              :key="category._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchingForm.keyword" placeholder="材料名/代号关键字" class="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searching" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMaterial">新增</el-button>
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
        <el-table-column label="库存数量" prop="left_count"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
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

    <el-dialog
      title="新增材料"
      :visible.sync="showDialog"
      width="30%"
      :before-close="resetMaterialForm"
    >
      <el-form
        :model="materialForm"
        :rules="materialRules"
        ref="materialForm"
        label-width="100px"
        class="material-dialog"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="代号" prop="no">
          <el-input v-model="materialForm.no"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="materialForm.model"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="specific">
          <el-input v-model="materialForm.specific"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="materialForm.category" placeholder="请选择材料分类">
            <el-option
              :label="category.name"
              :value="category._id"
              v-for="category in categories"
              :key="category._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="materialForm.supplier" placeholder="请选择供应商">
            <el-option
              :label="supplier.name"
              :value="supplier._id"
              v-for="supplier in suppliers"
              :key="supplier._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标价" prop="marked_price">
          <el-input v-model="materialForm.marked_price"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model="materialForm.image"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="materialForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancleSubmit">取消</el-button>
          <el-button type="primary" @click="submitMaterialForm">保存</el-button>
        </el-form-item>

        <!-- <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>-->
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
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
      materialForm: {
        no: '',
        name: '',
        specific: '',
        model: '',
        supplier: '',
        category: '',
        marked_price: '',
        image: '',
        remark: ''
      },
      materialRules: {},
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
      suppliers: [],
      page: {
        currentPage: 1,
        pageSize: 1,
        total: 1
      },
      currentMaterial: {},
      showDialog: false
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
        .catch(() => {
          this.$message.error('原材料接口调用失败')
        })
    },
    getCategories () {
      this.$axios
        .get('/categories', {
          params: {
            type: 'MATERIAL'
          }
        })
        .then(res => {
          this.materials = res.data.data
        })
        .catch(() => {
          this.$message.error('原材料类型接口调用失败')
        })
    },
    printer (targetElement) {
      window.jQuery(targetElement).printThis()
    },
    editMaterial () {},
    deleteMaterial () {},
    addMaterial () {
      this.showDialog = true
    },
    saveMaterial () {},
    resetMaterialForm () {
      this.showDialog = false
    },
    submitMaterialForm () {
      this.showDialog = false
    },
    cancleSubmit () {
      this.showDialog = false
    }
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
