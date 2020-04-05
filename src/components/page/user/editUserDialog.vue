<template>
  <el-dialog
    class="edit-dialog"
    title="用户信息修改"
    @close="closeDialog"
    :visible.sync="edit.isOpen"
    destroy-on-close
    width="50%"
  >
    <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="edit.isOpen = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  /* eslint-disable */
  name: "editUserDialog",
  props: {
    edit: {
      type: Object
    }
  },
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, val, callback) => {
      if (!val) {
        return callback(new Error('请输入邮箱'))
      } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
        callback(new Error('邮箱密码格式错误, 请检查'))
      } else {
        callback()
      }
    }
    // 验证电话号码
    var checkPhone = (rule, val, callback) => {
      if (!val) {
        return callback(new Error('请输入电话号码'))
      } else if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(val)) {
        callback(new Error('电话号码格式错误, 请检查'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        email: '',
        mobile: ''
      },
      formRules: {
        email: [{ validator: checkEmail, trigger: 'blur'}],
        mobile: [{ validator: checkPhone, trigger: 'blur'}]
      }
    }
  },
  methods: {
    closeDialog () {
      this.$refs['formRef'].resetFields()
      this.edit.isOpen = false
    },
    save () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.put(`/users/${this.edit.data.id}`, this.form)
        // 获取表单数据，调用修改接口
        if (data.meta.status !== 200) return this.$message.error('用户信息修改失败')
        this.$message.success('用户信息修改成功')
        this.edit.isOpen = false
      })
    }
  },
  watch: {
    'edit.data': {
      handler (newVal) {
        console.log('edit', newVal)
        this.form.username = newVal.username
        this.form.email = newVal.email
        this.form.mobile = newVal.mobile
      }
    }
  }
}
</script>

<style>
.edit-dialog .el-dialog__body {
  padding: 10px!important;
}
</style>
