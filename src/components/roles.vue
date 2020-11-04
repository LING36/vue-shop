<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="role"><el-button type="primary" @click="addRoleShow = true">添加角色</el-button></div>
      <el-table
        :data="rolesList"
        border
        stripe
        style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
            type="primary"
            size="medium"
            @click="editRolesFun(scope.row.id)"
            icon="el-icon-edit">编辑</el-button>
            <el-button
            size="medium"
            type="danger"
            @click="deleteRoles(scope.row.id)"
            icon="el-icon-delete">删除</el-button>
            <el-button
            size="medium"
            type="warning"
            icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleShow"
      @close="closeAddRoles('addRolesForm')"
      width="30%">
      <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="addRolesFun('addRolesForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleShow"
      @close="closeAddRoles('editRolesForm')"
      width="30%">
      <el-form :model="editRoles" :rules="addRolesRules" ref="editRolesForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="defineEditRoles('editRolesForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { rolesList, addRoles, queryRoles, defineRoles, deleteRoles } from '@/api/api'
export default {
  name: 'Roles',
  props: {},
  components: {},
  data () {
    return {
      addRoleShow: false, // 控制添加角色弹框显示隐藏
      editRoleShow: false, // 控制编辑角色弹框显示隐藏
      rolesList: [],
      addRoles: { // 添加角色 参数
        roleName: '',
        roleDesc: ''
      },
      editRoles: { // 编辑角色参数
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {

    // 角色列表
    getRolesList () {
      rolesList().then(res => {
        console.log(res)
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: '获取权限列表失败'
          })
          return
        }
        this.rolesList = data.data
      }).catch(err => {
        console.log(err)
      })
    },

    // 添加角色
    addRolesFun (formName) {
      this.$refs[formName].validate((valid) => { // 表单验证
        if (valid) {
          addRoles(this.addRoles).then(res => {
            console.log(res)
            this.$message({
              message: '角色添加成功',
              type: 'success'
            })
            this.getRolesList()
          }).catch(err => {
            console.log(err)
          })
          this.addRoleShow = false
        } else {
          return false
        }
      })
    },

    // 关闭添加角色对话框重置表单
    closeAddRoles (formName) {
      this.$refs[formName].resetFields()
    },

    // 点击编辑角色 获取角色信息
    editRolesFun (id) {
      this.editRoleShow = true
      queryRoles(id).then(res => {
        console.log(res)
        const { data } = res
        this.editRoles = data.data
      }).catch(err => {
        console.log(err)
      })
      console.log(id)
    },

    // 编辑角色确定
    defineEditRoles (formName) {
      this.$refs[formName].validate((valid) => { // 表单验证
        if (valid) {
          defineRoles(this.editRoles).then(res => {
            console.log(res)
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.getRolesList()
          }).catch(err => {
            console.log(err)
          })
          this.editRoleShow = false
        } else {
          return false
        }
      })
    },

    // 删除角色
    deleteRoles (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRolesList()
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
.role{
  text-align: left;
}
</style>
