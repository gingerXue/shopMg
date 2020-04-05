<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 操作卡片 -->
    <el-card class="card">
      <!--操作区域-->
      <div slot="header">
        <el-input clearable style="width: 40%;" placeholder="请输入搜索内容" @clear="inputCleared" v-model="queryData">
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
        </el-input>
        <el-button style="margin-left: 10px" type="primary" @click="addUser">添加用户</el-button>
      </div>
      <!--添加用户对话框-->
      <add-user :add.sync="add"></add-user>
      <!--修改用户对话框-->
      <edit-user :edit.sync="edit"></edit-user>
      <!--数据显示区域-->
      <el-table
        :data="tableData.userData"
        style="width: 90%;"
        fit
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="用户状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" active-color="#4999fd" inactive-color="#a2a4b5"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editUser(scope.row)"></el-button>
            <el-popconfirm title="您确定删除该用户吗？" @onConfirm="deleteUser(scope.row)">
              <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger"></el-button>
            </el-popconfirm>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button size="mini" icon="el-icon-setting" type="warning"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import addUser from './addUserDialog'
import editUser from './editUserDialog'
export default {
  name: 'users',
  components: { addUser, editUser },
  data () {
    return {
      add: {
        isOpen: false,
        data: null
      },
      edit: {
        isOpen: false,
        data: null
      },
      queryData: '',
      tableData: {
        userData: [],
        total: 0
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pageSize: 2
      }
    }
  },
  created () {
    this.userInit()
  },
  methods: {
    async userInit () {
      const { data } = await this.$http.get('/users', { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.tableData.userData = data.data.users.concat()
      this.tableData.total = data.data.total
    },
    searchUser () {
      this.queryInfo.query = this.queryData
      this.queryInfo.pagenum = 1
      this.userInit()
    },
    inputCleared () {
      this.queryInfo.query = ''
      this.userInit()
    },
    addUser () {
      this.add.isOpen = true
    },
    editUser (text) {
      this.edit.data = text
      this.edit.isOpen = true
    },
    async deleteUser (text) {
      console.log(text)
      const { data } = await this.$http.delete(`/users/${text.id}`)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success('用户删除成功')
      this.searchUser()
    },
    handleSizeChange (val) {
      this.queryInfo.pageSize = val
    },
    handleCurrentChange (val) {
      // 当点击特定的页码时，将这个值赋给pagenum
      this.queryInfo.pagenum = val
    },
    async changeState (val) {
      // 用户状态改变，请求修改接口
      const { data } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (data.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('用户状态设置失败,请检查服务器')
      }
      this.$message.success('更新成功')
    }
  },
  watch: {
    /* 'tableData.userData': {
      handler (newVal) {
        console.log(newVal)
      },
      deep: true
    }, */
    queryInfo: {
      handler (newVal) {
        this.userInit()
      },
      deep: true
    },
    add: {
      handler (newVal) {
        if (!newVal.isOpen) this.userInit()
      },
      deep: true
    },
    edit: {
      handler (newVal) {
        if (!newVal.isOpen) this.userInit()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.card {
  margin-top: 20px;
}
</style>
