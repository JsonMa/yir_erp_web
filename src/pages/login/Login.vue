<template>
  <el-row class="login">
    <el-col :span="8" :offset="8">
      <h2>重庆伊尔流体ERP系统登录</h2>
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号：" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
            placeholder="请输入用户名或手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('loginForm')">登录</el-button>
          <el-button @click="resetLogin('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Login',

  data () {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名或手机号'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          this.$axios
            .post('/auth/login', this.loginForm)
            .then(res => {
              const userInfo = Object.assign(res.data.data, res.data.meta)
              this.$store.dispatch('user/updateUser', userInfo)
              window.localStorage.setItem('user', JSON.stringify(userInfo))
              this.$router.push('/material')
            })
            .catch(err => {
              if (err.request && err.request.status === 400) {
                this.$message.error('账户或密码错误')
              } else this.$message.error('接口请求失败')
            })
        } else {
          return false
        }
      })
    },
    resetLogin (loginForm) {
      this.$refs[loginForm].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  display: flex;
  align-items: center;
  h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 25px;
  }
}
</style>
