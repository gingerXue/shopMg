<template>
  <div class="login-content">
    登录{{ msg }}
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: 'hello'
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .login-content {
    background-image: url("../assets/bg.png");
    background-size: 100% 100%;
    height: 100%;
  }
</style>
