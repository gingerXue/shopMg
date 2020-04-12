<template>
  <el-dialog
    class="add-cate"
    title="添加分类"
    @close="closeDialog"
    :visible.sync="addCate.isOpen"
    :destroy-on-close="true"
    width="50%"
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="form.cat_name"></el-input>
      </el-form-item>
      <el-form-item  label="父级分类" prop="parentCate">
        <el-cascader
          style="width: 100%;"
          clearable
          @change="handleChange"
          v-model="form.parentCate"
          :options="options"
          :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', checkStrictly: true }"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.cat_name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addCate.isOpen = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'addCateDialog',
  props: {
    addCate: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        cat_name: '',
        cat_pid: 0, // 父级分类id 0： 没有父级
        cat_level: 0, // 父级分类的等级 0: 没有父级
        parentCate: []
      },
      options: [],
      formRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeDialog () {
      this.$refs.formRef.resetFields()
      this.addCate.isOpen = false
    },
    save () {
      console.log('save', this.form)
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        // 添加分类
        const { data } = await this.$http.post(`/categories`, {
          cat_pid: this.form.cat_pid,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_level
        })
        if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
        this.$message.success(`添加成功`)
        this.addCate.isOpen = false
        this.$refs.formRef.resetFields()
      })
    },
    async cateInit () {
      // 父级分类级联框初始化
      const { data } = await this.$http.get(`/categories`, { params: { type: 2 } })
      if (data.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.options = data.data
    },
    handleChange () {
      const selectData = this.form.parentCate
      if (selectData.length > 0) {
        // 如果数组长度大于0，证明选中的父级分类，反之就没有选中任何父级分类
        this.form.cat_pid = selectData[selectData.length - 1]
        this.form.cat_level = selectData.length
      } else {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      }
    }
  },
  watch: {
    addCate: {
      handler (val) {
        val.isOpen && this.cateInit()
      },
      deep: true
    },
    'form.parentCate': {
      handler (val) {
        if (val.length === 0) {
          this.form.cat_pid = 0
          this.form.cat_level = 0
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
