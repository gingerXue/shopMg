<template>
  <el-dialog
    class="add-dialog"
    title="权限分配"
    @close="closeDialog"
    :visible.sync="distribute.isOpen"
    destroy-on-close
    width="50%"
  >
    <el-tree
      :props="props"
      ref="tree"
      :data="rightsList"
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="defCK"
      show-checkbox
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'distributeDialog',
  props: {
    distribute: {
      type: Object
    }
  },
  data () {
    return {
      props: {
        label: 'authName',
        children: 'children'
      },
      rightsList: null,
      defCK: [] // 默认选中的节点
    }
  },
  methods: {
    closeDialog () {
      this.defCK = []
      this.distribute.isOpen = false // 关闭dialog
    },
    async pageInit () {
      const { data } = await this.$http.get(`rights/tree`)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.rightsList = JSON.parse(JSON.stringify(data.data)) // 深拷贝
    },
    defCkInit (text) {
      // 利用递归获取第三级节点的id
      if (!text.children) return this.defCK.push(text.id)
      for (let i = 0, arrLen = text.children.length; i < arrLen; i++) {
        this.defCkInit(text.children[i])
      }
    },
    async confirm () {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const { data } = await this.$http.post(`roles/${this.distribute.data.id}/rights`, { rids: keys.join(',') })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success('分配权限成功')
      this.distribute.isOpen = false
    }
  },
  watch: {
    distribute: {
      handler (val) {
        if (val.isOpen) {
          this.pageInit() // 初始化树组件
          this.defCkInit(val.data) // 初始化树中被选中的数据
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
