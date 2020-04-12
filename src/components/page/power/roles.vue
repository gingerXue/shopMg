<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="card">
      <el-button style="margin-bottom: 15px" type="primary" @click="addRole">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 90%;"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--<pre>{{scope.row}}</pre>-->
            <el-row
              type="flex"
              align="middle"
              v-for="(item1, index1) in scope.row.children"
              :class="['btom', index1 === 0 ? 'btop' : '']"
              :key="item1.id">
              <!--一级-->
              <el-col :span="8">
                <el-tag closable @close="handleClose(item1.id, scope.row)" type="primary">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="16">
                <!--二级-->
                <el-row
                  type="flex"
                  align="middle"
                  :class="[index2 === 0 ? '' : 'btop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="handleClose(item2.id, scope.row)" type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--三级-->
                    <el-tag
                      @close="handleClose(item3.id, scope.row)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 数据列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editRole(scope.row)">编辑</el-button>
            <el-popconfirm title="您确定删除该角色吗？" @onConfirm="deleteRole(scope.row)">
              <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
            </el-popconfirm>
            <el-button size="mini" icon="el-icon-setting" type="warning" @click="distribute(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <distribute :distribute.sync="distributeDialog"></distribute>
    </el-card>
  </div>
</template>

<script>
import distribute from './distributeDialog'
export default {
  name: 'roles',
  components: { distribute },
  data () {
    return {
      tableData: [],
      distributeDialog: {
        isOpen: false,
        data: null
      }
    }
  },
  created () {
    this.roleInit()
  },
  methods: {
    editRole (text) {
      console.log('编辑')
    },
    deleteRole (text) {
      console.log('删除')
    },
    distribute (text) {
      // 循环children属性
      this.distributeDialog.isOpen = true
      this.distributeDialog.data = text
    },
    addRole () {
    },
    async roleInit () {
      const { data } = await this.$http.get('/roles')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.tableData = data.data
    },
    async handleClose (rightId, role) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件,是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') return
      // 请求接口删除角色指定权限
      const { data } = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success('删除成功!')
      // this.roleInit()
      role.children = data.data
    }
  },
  watch: {
    'distributeDialog.isOpen': {
      handler (val) {
        if (val === false) {
          this.roleInit()
        }
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
  .el-tag {
    margin: 5px;
  }
  .btop {
    border-top: 1px solid #eee;
  }
  .btom {
    border-bottom: 1px solid #eee;
  }
</style>
