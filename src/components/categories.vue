<template>
<!-- 商品分类页面 -->
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div class="addCategories"><el-button type="primary" size="small ">添加分类</el-button></div>
      <!-- 表格 -->
      <tree-table
        :data="catelist.result"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
        v-loading="loading"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error"
            style="color:red;"
            v-else></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini">删除</el-button>
        </template>

      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="catelist.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from '@/api/api'
export default {
  name: '',
  props: {},
  components: {},
  data () {
    return {
      loading: true,
      // 商品分类的数据列表
      catelist: [],
      // 商品分类列表接口参数
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCatelist()
  },
  methods: {
    // 切换一页数据数目
    handleSizeChange (val) {
      this.querInfo.pagesize = val
      this.querInfo.pagenum = 1
      this.loading = true
      this.getCatelist()
    },
    // 切换页码
    handleCurrentChange (val) {
      this.querInfo.pagenum = val
      this.loading = true
      this.getCatelist()
    },

    // 获取商品分类数据
    getCatelist () {
      getCategories(this.querInfo).then(res => {
        console.log(res)
        const { data } = res
        console.log(data)
        this.loading = false
        if (data.meta.status !== 200) {
          this.$message({
            message: '获取用户列表失败'
          })
          return
        }
        this.catelist = data.data
      }).catch(() => {
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
.addCategories{
  text-align: left;
  margin-bottom: 20px;
}
.el-pagination{
  margin-top: 20px;
}
</style>
