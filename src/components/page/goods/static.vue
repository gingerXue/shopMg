<template>
  <div class="container">
    <el-button :disabled="isSel" type="primary" size="mini">添加属性</el-button>
    <el-table
      :data="tableData"
      style="width: 90%;margin-top: 15px"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="参数值" prop="attr_vals"></el-table-column>
      <!--<el-table-column></el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'static',
  props: {
    staticData: {
      type: Number
    }
  },
  data () {
    return {
      isSel: true,
      tableData: []
    }
  },
  methods: {
    async tabInit (val) {
      const { data } = await this.$http.get(`categories/${val}/attributes`, { params: { sel: 'only' } })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.tableData = data.data
    }
  },
  watch: {
    staticData: {
      handler (val) {
        if (val) {
          this.isSel = false
          this.tabInit(val)
        } else {
          this.isSel = true
          this.tableData = []
        }
      }
    }
  }
}
</script>

<style scoped>
  .container {
    padding: 5px 10px 10px 10px;
  }
</style>
