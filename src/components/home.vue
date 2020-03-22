<template>
  <div>
    home
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    quit () {
      this.$alert('您确定退出吗？', '退出', {
        confirmButtonText: '确定',
        callback: action => {
          // 清空sessionStorage中的token
          window.sessionStorage.clear()
          // 重定向回登录页面
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
