<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="card">
      <el-table
        :data="rightsList"
        style="width: 90%;"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <!--:type="scope.row.level === '家' ? 'primary' : 'success'"-->
            <el-tag
              :type="getType(scope.row.level)"
              disable-transitions
            >{{getTypeName(scope.row.level)}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data () {
    return {
      rightsList: [] // 权限列表
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data } = await this.$http.get(`rights/list`)
      // console.log(data)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.rightsList = data.data
    },
    getType (text) {
      return text === '0' ? 'primary'
        : text === '1' ? 'success' : 'warning'
    },
    getTypeName (text) {
      return text === '0' ? '一级'
        : text === '1' ? '二级' : '三级'
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
/*.card::-webkit-scrollbar {display:none}*/
</style>
