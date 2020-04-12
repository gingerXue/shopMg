<template>
  <el-dialog
    class="distribute-dialog"
    title="分配角色"
    @close="closeDialog"
    :visible.sync="distribute.isOpen"
    destroy-on-close
    width="50%"
  >
    <!--{{ distribute.data }}-->
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前用户">
            <el-input disabled v-model="form.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前角色">
            <el-input disabled v-model="form.rolename"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="分配新角色">
            <el-select style="width: 100%;" v-model="form.s_role" placeholder="请选择角色">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="distribute.isOpen = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'distributeRoles',
  props: {
    distribute: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        username: '',
        rolename: '',
        s_role: ''
      },
      rolesList: []
    }
  },
  methods: {
    async save () {
      console.log(this.form)
      if (!this.form.s_role) return this.$message.error('请选择要分配的新角色')
      // 分配用户角色
      const { data } = await this.$http.put(`users/${this.distribute.data.id}/role`, { rid: this.form.s_role })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success('分配成功')
      this.distribute.isOpen = false // 关闭对话框
    },
    closeDialog () {
      this.distribute.isOpen = false
      this.form.s_role = ''
    },
    async getRoles () {
      // 获取角色列表
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.rolesList = data.data
    }
  },
  watch: {
    distribute: {
      handler (val) {
        if (val.isOpen) {
          // 对话框打开
          console.log(val.data)
          this.getRoles()
          this.form.username = val.data.username
          this.form.rolename = val.data.role_name
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.distribute-dialog  .el-dialog__body {
  padding: 10px!important;
}
</style>
