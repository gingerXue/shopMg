<template>
  <div class="home-container">
    <div class="header" :style="{ height: `${layout.containerLayout.headerHeight}px`}">
      <img src="../../assets/logo.png" alt="logo">
      <h2>电商后台管理系统</h2>
      <div class="welcome">
        <span style="margin-right: 10px">您好,{{ name }}</span>
        <el-button @click="quit" type="info">退出</el-button>
      </div>
    </div>
    <div class="main" :style="{ height: mainHeight }">
      <div class="main-left" :style="{ width: mainLeftWidth }">
        <!-- 菜单栏上侧的展开收缩按钮 -->
        <div class="toggle-btn" @click="isCollapse=!isCollapse">|||</div>
        <!-- 左侧菜单栏 -->
        <el-menu
          unique-opened
          router
          :default-active="$route.path"
          :collapse="isCollapse"
          :collapse-transition="false"
          style="border-right: 0px;"
          @open="handleOpen"
          @close="handleClose"
          text-color="#fff"
          background-color="#333744"
          active-text-color="#409eff"
        >
          <el-submenu :index="'/' + item.path" :key="item.id" v-for="item in menubar">
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 标题 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + citem.path" :key="citem.id" v-for="citem in item.children">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ citem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!--<el-menu-item v-else :index="item.path">
            <template slot="title">{{ item.authName }}</template>
          </el-menu-item>-->
        </el-menu>
      </div>
      <div class="main-center">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// import functionList from './functionList'
export default {
  name: 'home',
  components: {
    // functionList
  },
  data () {
    return {
      name: 'xjz',
      isCollapse: false,
      // 布局配置
      layout: {
        containerLayout: {
          headerHeight: 80 // 头部高度
        },
        mainLayout: {
          leftWidth: 220 // 左侧宽度
        }
      },
      icons: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-claim',
        '101': 'el-icon-s-finance',
        '102': 'el-icon-s-shop',
        '145': 'el-icon-s-data'
      },
      /*
        { name: 'userMg', title: '用户管理', icon: 'el-icon-s-custom' },
        { name: 'authMg', title: '权限管理', icon: 'el-icon-s-claim' },
        { name: 'goodsMg', title: '商品管理', icon: 'el-icon-s-finance' },
        { name: 'paymentMg', title: '订单管理', icon: 'el-icon-s-shop' },
        { name: 'dataMg', title: '数据统计', icon: 'el-icon-s-data' }
      */
      menubar: [],
      selectPage: 'workTable'
    }
  },
  created () {
    this.getMenuBarData() // 获取左侧侧边栏菜单的数据
  },
  mounted () {
  },
  methods: {
    quit () {
      this.$alert('您确定退出吗？', '退出', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'cancel') return
          // 清空sessionStorage中的token
          window.sessionStorage.clear()
          // 重定向回登录页面
          this.$router.push('/login')
        }
      })
    },
    selectItem (val) {
      console.log('home', val)
      this.selectPage = val
    },
    handleOpen (val) {
      console.log('open', val)
    },
    handleClose (val) {
      console.log('close', val)
    },
    async getMenuBarData () {
      try {
        const { data } = await this.$http.get('/menus')
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.menubar = data.data
      } catch (e) {
        this.$message.error('出了点小意外，请联系管理员')
      }
    }
  },
  computed: {
    mainHeight () {
      return `${window.innerHeight - this.layout.containerLayout.headerHeight}px`
    },
    mainLeftWidth () {
      return !this.isCollapse ? `${this.layout.mainLayout.leftWidth}px` : '64px'
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    height: 100%;
  }
  .header {
    color: #f1f1f1;
    padding: 20px 23px 0 30px;
    box-sizing: border-box;
    background-color: #373D41;
    img {
      display: block;
      float: left;
      margin-top: 3px;
      width: 25px;
      height: 25px;
    }
    h2 {
      display: inline-block;
      margin: 0 0 0 5px;
    }
    .welcome {
      float: right;
    }
  }
  .main {
    display: flex;
    .main-left {
      transition: width .5s;
      overflow-y: scroll;
      background-color: #333744;
      color: #f1f1f1;
    }
    .main-left::-webkit-scrollbar { display: none }
    .main-center {
      box-sizing: border-box;
      padding: 20px 15px 15px 15px;
      background-color: #EAEDF1;
      width: 100%
    }
  }
  .toggle-btn {
    height: 20px;
    background-color: #4A5064;
    cursor: pointer;
    text-align: center;
    font-size: 10px;
    line-height: 20px;
    letter-spacing: .2em;
    color: #c3c3c3;
  }
</style>
