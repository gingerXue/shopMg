<template>
  <ul class="menubar" ref="ulDom">
    <li class="menubar-item" v-for="(item, index) in copiedList" :key="item.name" @click.stop="handleClick(index)">
      <!--:style="{ paddingLeft: (item.isInline ? '30px' : '')}"-->
      <div class="item-title" :style="paddingStyle">
        <i class="item-icon" :class="item.icon"></i>
        <!-- :style="{ color: (selectIndex === index ? '#ffd04b' : '')}"-->
        <span>{{ item.title }}</span>
        <i v-if="item.children" :class="setIconClass(item.isOpened)"></i>
      </div>
      <!-- 递归组件 -->
      <function-list
        v-if="item.children"
        v-show="item.isOpened"
        class="menubar-inline"
        @selectItem="selectItem"
        :list="item.children"
      ></function-list>
      <!--class="sub-menubar"-->
      <!--<div v-if="item.children" v-show="item.isOpened" class="sub-menubar">
        <function-list @selectItem="selectItem" :list="item.children"></function-list>
      </div>-->
    </li>
  </ul>
</template>

<script>
export default {
  name: 'functionList',
  props: {
    list: Array
  },
  data () {
    return {
      copiedList: []
      /* menubar: [
        { name: 'userMg', title: '用户管理', icon: 'el-icon-s-custom', children: [{ name: 'userMg_c1', title: '添加用户' }, { name: 'userMg_c2', title: '删除用户' }] },
        { name: 'authMg', title: '权限管理', icon: 'el-icon-s-claim', children: [{ name: 'authMg_c1', title: '添加用户1' }, { name: 'authMg_c2', title: '删除用户1' }] },
        { name: 'goodsMg', title: '商品管理', icon: 'el-icon-s-finance', children: [{ name: 'goodsMg_c1', title: '添加商品' }, { name: 'goodsMg_c2', title: '删除商品' }] },
        { name: 'paymentMg', title: '订单管理', icon: 'el-icon-s-shop', children: [{ name: 'paymentMg_c1', title: '添加订单' }, { name: 'paymentMg_c2', title: '删除订单' }] },
        { name: 'dataMg', title: '数据统计', icon: 'el-icon-s-data' }
      ], */
    }
  },
  mounted () {
    this.copiedList = JSON.parse(JSON.stringify(this.list)) // 深拷贝list，主要是不想影响到原始的数据
    this.copiedList.map(item => {
      item.isOpened = false // 给数组中每一项数据添加一个isOpened属性来判断是否展开这一项数据
    })
  },
  methods: {
    handleClick (index) {
      let item = this.copiedList[index]
      if (!item.children) {
        // 没有子节点
        // this.selectIndex = index

        this.$emit('selectItem', item.name)
      } else {
        // 有子节点
        item.isOpened = !item.isOpened
        // this.$set() 针对的是数组中元素的数据改变
        // 对象数组中一个对象元素里的数据改变Vue是可以监听到的，但是不能实时渲染到页面上
        // 这时才需要用到$forceUpdate
        this.$forceUpdate()
      }
    },
    // 获取递归节点的值
    selectItem (val) {
      this.$emit('selectItem', val)
    },
    setIconClass (val) {
      // 需要用到v-for里的数据 只能拿到方法里进行赋值
      // val 是isOpened的值，如果true 则旋转右侧的图标90度
      let obj = {
        select: true,
        'select-open': val,
        'el-icon-caret-right': true
      }
      return obj
    }
  },
  computed: {
    paddingStyle () {
      let padding = 30
      const inlineClass = this.$refs.ulDom.className
      return { paddingLeft: inlineClass.indexOf('menubar-inline') !== -1 ? padding + 'px' : '' }
    }
  },
  watch: {
    copiedList: {
      handler (val) {
        // console.log(val)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .menubar {
    user-select:none;
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .menubar > .menubar-item {
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .item-title:hover {
    transition: background-color .3s;
    background-color: #3b3f4b;
  }
  .item-title {
    box-sizing: border-box;
    cursor:pointer;
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    padding:0 15px;
    white-space: nowrap;
    position: relative;
  }
  .item-icon {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
  }
  .select {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -7px;
    transition: transform .3s;
  }
  .select-open {
    transform: rotate(90deg);
  }
  .sub-menubar {
    /*height: 30px;*/
    overflow: hidden;
    list-style: none;
    padding-left: 15px;
    /*transition: height .3s;*/
  }
  .menubar-inline {
    overflow: hidden;
    background-color: #292d39;
    /*padding-left: 15px;*/
  }

</style>
