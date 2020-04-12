<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="card">
      <!--按钮-->
      <el-button style="margin-bottom: 15px" type="primary" @click="addCategories">添加分类</el-button>
      <!--添加分类dialog-->
      <add-cate :addCate="addCate"></add-cate>
      <!--表格区域-->
      <el-table
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="cat_id"
        :data="tableData.data"
        style="width: 90%;"
        border
        stripe
      >
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template slot-scope="scope">
            <i :class="scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template slot-scope="scope">
            <el-tag
              :type="getType(scope.row.cat_level)"
              disable-transitions
            >{{ getTypeName(scope.row.cat_level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editCate(scope.row)">编辑</el-button>
            <el-popconfirm title="您确定删除该角色吗？" @onConfirm="deleteCate(scope.row)">
              <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import addCate from './addCateDialog'
export default {
  name: 'cate',
  components: { addCate },
  data () {
    return {
      tableData: { // 表格数据
        data: [],
        total: 0
      },
      queryInfo: { // 分页组件查询的参数
        type: 3,
        pageSize: 5,
        pagenum: 1
      },
      addCate: {
        isOpen: false,
        data: null
      }
    }
  },
  created () {
    this.cateInit() // 初始化分类数据
  },
  methods: {
    async cateInit () {
      const { data } = await this.$http.get(`/categories`, { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.tableData.data = data.data.result
      this.tableData.total = data.data.total
    },
    getType (text) {
      return text === 0 ? 'primary'
        : text === 1 ? 'success' : 'warning'
    },
    getTypeName (text) {
      return text === 0 ? '一级'
        : text === 1 ? '二级' : '三级'
    },
    addCategories () {
      this.addCate.isOpen = true
    },
    editCate (text) {
    },
    deleteCate (text) {
    },
    handleSizeChange (val) {
      // 改变一页显示的数据条数
      this.queryInfo.pageSize = val
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
    }
  },
  watch: {
    queryInfo: {
      handler (newVal) {
        this.cateInit()
      },
      deep: true
    },
    'addCate.isOpen': {
      handler (val) {
        if (!val) this.cateInit()
      }
    }
  }
}
</script>

<style scoped>
  .card {
    margin-top: 20px;
    height: 80vh;
    overflow-y: scroll;
  }
  .el-icon-success {
    color: #67C23A;
  }
  .el-icon-error {
    color: #e57471;
  }
</style>
