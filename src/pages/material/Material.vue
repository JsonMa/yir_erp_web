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
      <el-table :data="materials" style="width: 100%" v-loading="tableLoading">
        <el-table-column label="序号" prop="index" width="60px"></el-table-column>
        <el-table-column label="材料编号" prop="no"></el-table-column>
        <el-table-column label="材料名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category.name"></el-table-column>
        <el-table-column label="供应商" prop="supplier.name"></el-table-column>
        <el-table-column label="材料型号" prop="model"></el-table-column>
        <el-table-column label="完整品数量" prop="left_num"></el-table-column>
        <el-table-column label="废品数量" prop="wasted_num"></el-table-column>
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
      :title="materialDialogTitle"
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
        <el-form-item label="单位" prop="unit">
          <el-input v-model="materialForm.unit"></el-input>
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
        <!-- <el-form-item label="标价" prop="marked_price">
          <el-input v-model="materialForm.marked_price"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="图片" prop="image">
          <el-input v-model="materialForm.image"></el-input>
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="materialForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancleSubmit">取消</el-button>
          <el-button type="primary" @click="submitMaterialForm('materialForm')">保存</el-button>
        </el-form-item>
      </el-form>
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
      materialDialogTitle: '',
      materialForm: {
        no: '',
        name: '',
        specific: '',
        model: '',
        supplier: '',
        category: '',
        marked_price: 0,
        // image: '',
        remark: '',
        unit: ''
      },
      materialRules: {
        no: [{ required: true, message: '材料代号为必填', trigger: 'blur' }],
        name: [{ required: true, message: '材料名称为必填', trigger: 'blur' }],
        specific: [
          { required: true, message: '材料规格为必填', trigger: 'blur' }
        ],
        model: [{ required: true, message: '材料型号为必填', trigger: 'blur' }],
        supplier: [
          { required: true, message: '供应商为必填', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '材料分类为必填', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '材料单位为必填', trigger: 'blur' }]
      },
      materials: [],
      categories: [],
      suppliers: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      currentMaterial: {},
      showDialog: false,
      tableLoading: true
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
          params: Object.assign(defaultParams, this.$route.params, params)
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
          this.tableLoading = false
        })
        .catch(() => {
          this.$message.error('原材料接口调用失败')
        })
    },
    getCategories () {
      this.$axios
        .get('/categories', {
          params: {
            type: 'MATERIAL',
            limit: 10000
          }
        })
        .then(res => {
          this.categories = res.data.data
        })
        .catch(() => {
          this.$message.error('原材料类型接口调用失败')
        })
    },
    getSuppliers () {
      this.$axios
        .get('/cooperators', {
          params: {
            limit: 10000,
            type: 'SUPPLIER'
          }
        })
        .then(res => {
          this.suppliers = res.data.data
        })
        .catch(() => {
          this.$message.error('供应商接口调用失败')
        })
    },
    printer (targetElement) {
      window.jQuery(targetElement).printThis()
    },
    editMaterial (index, row) {
      this.materialDialogTitle = '修改原材料';
      this.showDialog = true
      this.materialForm = row
    },
    deleteMaterial (index, row) {
      this.$confirm('此操作将永久删除该原材料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(`/materials/${row._id}`)
            .then(res => {
              this.$message.success({
                message: '删除材料成功',
                duration: 1500,
                onClose: () => {
                  this.showDialog = false
                  this.searching(true)
                }
              })
            })
            .catch(() => {
              this.$message.error('删除材料接口调用失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addMaterial () {
      this.materialDialogTitle = '新增原材料';
      this.showDialog = true
    },
    saveMaterial () {},
    resetMaterialForm () {
      this.showDialog = false
    },
    submitMaterialForm (form) {
      let url = '/materials';
      let method = 'post';
      const formData = this[form]
      const isUpdate = !!formData._id

      if (isUpdate) {
        url = `/materials/${formData._id}`
        method = 'patch';
        formData.category = formData.category._id
        formData.supplier = formData.supplier._id
        delete formData.enable
        delete formData.index
        delete formData.created_at
        delete formData.updated_at
        delete formData.wasted_num
        delete formData.total_num
        delete formData.__v
        delete formData._id
        delete formData.left_num
        delete formData.marked_price
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
                message: isUpdate ? '修改材料成功' : '新增材料成功',
                duration: 1500,
                onClose: () => {
                  this.showDialog = false
                  this.searching(true)
                }
              })
            })
            .catch(err => {
              if (err.request && err.request.status === 400) {
                this.$message.error('参数错误')
              } else this.$message.error('接口请求失败')
            })
        } else {
          return false
        }
      })
    },
    cancleSubmit () {
      this.showDialog = false
    }
  },

  mounted () {
    this.getCategories()
    this.getMaterials()
    this.getSuppliers()
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
    padding: 20px 0;
    .paging-item {
      text-align: center;
    }
  }
  .material-breadcrumb {
    padding: 20px 0 20px 0;
  }
}
</style>
