<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        show-icon
        :closable="false"
        type="warning">
      </el-alert>
      <div class="input-container">
        选择商品分类:
        <el-cascader
          style="width: 30%;"
          clearable
          @change="handleChange"
          v-model="goodsCate"
          :options="options"
          :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.cat_name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <el-tabs v-model="activeName" >
          <el-tab-pane label="动态参数" name="dynamic">
            <dynamic-param :dynamic.sync="dynamicData"></dynamic-param>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="static">
            <static-attribute :staticData.sync="staticData"></static-attribute>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import dynamicParam from './dynamic'
import staticAttribute from './static'
export default {
  name: 'params',
  components: { dynamicParam, staticAttribute },
  data () {
    return {
      goodsCate: [], // 商品分类
      options: [], // 级联框选项数据
      activeName: 'dynamic',
      dynamicData: null,
      staticData: null,
      cateId: null
      /* dynamicData: {
        isActive: true,
        data: null
      },
      staticData: {
        isActive: false,
        data: null
      } */
    }
  },
  created () {
    this.cateInit()
  },
  methods: {
    handleChange (val) {
      // 判断选中的数组长度如果等于2就是第三级分类
      if (val.length !== 3) {
        this.cateId = null
        this.goodsCate = []
      } // 如果不是第三级分类 就清空
      this.cateId = val[2]
    },
    async cateInit () {
      // 父级分类级联框初始化
      const { data } = await this.$http.get(`/categories`, { params: { type: 3 } })
      if (data.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.options = data.data
    }
  },
  computed: {
    cateAndTab () {
      const { cateId, activeName } = this
      return {
        cateId,
        activeName
      }
    }
  },
  watch: {
    cateAndTab: {
      handler (val) {
        // 同时监听两个属性
        if (val.activeName === 'dynamic') {
          this.dynamicData = val.cateId
        } else {
          this.staticData = val.cateId
        }
      }
    }
    /* activeName: {
      handler (val) {
        if (this.activeName === 'dynamic') {
          // 激活的动态参数页面
          this.dynamicData = this.cateId
        } else {
          // 激活的静态属性页面
          this.staticData = this.cateId
        }
      }
    } */
  }
}
</script>

<style>
  .container .el-card {
    margin-top: 20px;
    height: 80vh;
    overflow-y: scroll;
  }
  .card .el-card__body {
    padding: 10px!important;
  }
  .input-container {
    margin-top: 20px;
  }
  .input-container .el-cascader {
    margin-left: 10px!important;
  }
  .container .el-tabs {
    margin-top: 20px!important;
  }
</style>
