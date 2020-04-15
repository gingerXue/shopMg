<template>
  <div class="container">
    <el-button :disabled="isSel" type="primary" size="mini">添加参数</el-button>
    <el-table
      :data="tableData"
      style="width: 90%;margin-top: 15px"
      border
      stripe
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag
            style="margin-left: 5px"
            closable
            v-for="(item, index) in scope.row.attr_vals"
            :key="index"
            type="primary"
            @close="handleClose(scope.row, index)"
          >{{ item }}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="editParam(scope.row)">编辑</el-button>
          <el-popconfirm title="您确定删除该参数 吗？" @onConfirm="deleteParam(scope.row)">
            <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <!--<el-table-column></el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'dynamic',
  props: {
    dynamic: {
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
      const { data } = await this.$http.get(`categories/${val}/attributes`, { params: { sel: 'many' } })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      data.data.map(item => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      this.tableData = data.data
    },
    editParam (text) {
      console.log(text)
    },
    deleteParam (text) {
      console.log(text)
    },
    showInput (val) {
      val.inputVisible = true
      // $nextTick,当页面元素被重新渲染之后才会执行回调函数中的代码
      // 文本输入框在被渲染出来之后才会执行nextTick这个函数
      // 如果不用nextTick那么页面中是没有input框的dom元素，也就获取不到input的焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (val, index) {
      // 删除attr_vals中对应的数据
      val.attr_vals.splice(index, 1)
      this.saveAttr(val)
    },
    async handleInputConfirm (val) {
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
        return
      }
      let inputValue = val.inputValue // 获取新标签input里的数据
      if (inputValue) {
        // 如果有数据就放到属性值的数组中
        val.attr_vals.push(inputValue)
      }
      // 清空input里的数据，并把input框隐藏
      val.inputValue = ''
      val.inputVisible = false
      // categories/:id/attributes/:attrId
      // 发起请求，保存这次操作
      this.saveAttr(val)
    },
    async saveAttr (row) {
      const { data } = await this.$http.put(`categories/${this.dynamic}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success('保存成功')
    }
  },
  /* computed: {
    attrVals (val) {
      return function (val) {
        return val ? val.split(',') : []
      }
    }
  }, */
  watch: {
    dynamic: {
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

<style>
  .container {
    padding: 5px 10px 10px 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
