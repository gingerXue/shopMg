<template>
  <el-dialog
    class="add-dialog"
    title="添加用户"
    @close="closeDialog"
    :visible.sync="add.isOpen"
    destroy-on-close
    width="50%"
  >
    <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="add.isOpen = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  /* eslint-disable */
  name: 'addUserDialog',
  props: {
    add: {
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
        password: '',
        email: '',
        mobile: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '用户名长度在5～10位字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '密码长度在5～10位字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur'}],
        mobile: [{ validator: checkPhone, trigger: 'blur'}]
      }
    }
  },
  methods: {
    save () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        // 获取表单数据，调用保存接口
        const { data } = await this.$http.post('/users', this.form)
        if (data.meta.status !== 201) return this.$message.error(meta.msg)
        this.$message.success('用户添加成功')
        this.add.isOpen = false
      })
    },
    closeDialog () {
      this.$refs['formRef'].resetFields()
      this.add.isOpen = false
    }
  }
}
</script>

<style>
  .add-dialog  .el-dialog__body {
    padding: 10px!important;
  }
</style>
