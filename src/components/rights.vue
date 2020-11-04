<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { rights } from '@/api/api'
export default {
  name: 'Rights',
  props: {},
  components: {},
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    // 获取权限列表数据
    getRights () {
      rights().then(res => {
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: '获取权限列表失败'
          })
          return
        }
        this.rightsList = data.data
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
</style>
