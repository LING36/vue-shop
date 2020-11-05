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
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
            v-for="(item, index) in scope.row.children"
            :key="item.id"
            :class="['bdbottom', 'vcentr', index===0?'bdtop':'']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                v-for="(item2, index2) in item.children"
                :key="item2.id"
                :class="['vcentr', index2===0?'':'bdtop']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      closable>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
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
            @click="showSetRightDialog(scope.row)"
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

    <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRight"
      @close="setRightDialogClosed"
      width="30%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        default-expand-all
        :default-checked-keys="defKeys"
        node-key="id"
        ref="treeRef"
        show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRight = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  rolesList,
  addRoles,
  queryRoles,
  defineRoles,
  deleteRoles,
  deleteRight,
  rights,
  authorizeRight
} from '@/api/api'

export default {
  name: 'Roles',
  props: {},
  components: {},
  data () {
    return {
      addRoleShow: false, // 控制添加角色弹框显示隐藏
      editRoleShow: false, // 控制编辑角色弹框显示隐藏
      showSetRight: false, // 控制分配权限弹框显示隐藏
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
      },
      rightsList: [], // 所有权限列表数据
      treeProps: { // 树形控件属性绑定对象
        children: 'children',
        label: 'authName'
      },
      defKeys: [], // 默认勾选的节点的 key 的数组
      roleId: null
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
    },

    // 删除三级权限里的子权限
    removeRightById (row, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRight(row.id, rightId).then(res => {
          const { data } = res
          if (data.meta.status !== 200) {
            this.$message({
              message: '删除权限失败'
            })
            return
          }
          row.children = data.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 点击分配权限
    showSetRightDialog (row) {
      // 获取所有权限的数据
      rights('tree').then(res => {
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: '获取权限列表失败'
          })
          return
        }
        this.rightsList = data.data
        this.roleId = row.id
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 递归获取三级节点
      this.getLeafKeys(row, this.defKeys)
      this.showSetRight = true
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      if (!node.children) { // 没有children属性表示是第三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },

    // 分配权限
    allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',') // 数组变字符串
      authorizeRight(this.roleId, idStr).then(res => {
        const { data } = res
        this.showSetRight = false
        if (data.meta.status !== 200) {
          this.$message({
            message: '分配权限失败'
          })
          return
        }
        this.$message({
          type: 'success',
          message: '分配权限成功'
        })
        this.getRolesList()
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
.role{
  text-align: left;
}
.el-tag{
  margin: 10px;
}
.bdbottom{
  border-bottom: 1px solid #e7e7e7;
}
.bdtop{
  border-top: 1px solid #e7e7e7;
}
.vcentr{
  display: flex;
  align-items: center;
}
</style>
