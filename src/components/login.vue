<template>
  <div class="login-content">
    <div class="login-area">
      <div class="login-img">
        <img src="../assets/logo.png" alt="用户头像">
      </div>
      <el-form class="login-form" ref="form" :rules="rules" :model="form">
        <el-form-item prop="username">
          <el-input
            size="small"
            v-model="form.username"
            prefix-icon="el-icon-user"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="small"
            v-model="form.password"
            prefix-icon="el-icon-lock"
            show-password
            placeholder="密码"
          />
        </el-form-item>
      </el-form>
      <el-button @click="login" style="width: 95%; margin-left: 10px" type="primary">登 录</el-button>
      <div class="forget-password">
        <el-link type="info">忘记密码？</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        try {
          const { data } = await this.$http.post('/login', this.form)
          if (data.meta.status !== 200) {
            // 登陆失败
            this.$message.error(`登录失败,${data.meta.msg}`)
          } else {
            // 登录成功
            /**
            * 1. 登录成功之后将token保存在sessionStorage中
            * 2. 利用路由跳转到后台主页页面
            */
            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          }
        } catch (e) {
          this.$message.error('出了点小意外，请联系管理员')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-content {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2b4b6b;
    background-size: 100% 100%;
    height: 100%;
  }
  .login-area {
    width: 400px;
    height: 300px;
    border-radius: 5px;
    background-color: floralwhite;
    padding: 15px;
    box-sizing: border-box;
    .login-form {
      margin: -15px 10px 10px 10px;
    }
    .login-img {
      position: relative;
      top: -55px;
      margin: auto;
      height: 80px;
      width: 80px;
      border-radius: 120px;
      background-color: #ffffff;
      text-align: center;
      box-shadow: 0 0 5px #ddd;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        border-radius: 120px;
      }
    }
    .forget-password {
      text-align: right;
      margin-top: 10px;
    }
  }
</style>
