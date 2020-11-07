<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <div>
        <el-row :gutter="15">
          <el-col :span="6">
            <el-input placeholder="请输入内容" class="input-with-select"
            v-model="params.query" clearable @clear="clear">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        :data="usersList.users"
        style="width: 100%"
        bordertrue
        size="small"
        stripe
        v-loading="loading">
        <el-table-column
          type="index"
          :index="indexMethod"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                <el-button
                size="medium"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                circle></el-button>
              </el-tooltip>
              <el-button
              size="medium"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
              circle></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button size="medium" type="warning" icon="el-icon-setting" circle
                @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersList.total">
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="closeForm('addFormRef')">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          size="medium"
          label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
           <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addFormRef')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialog"
        width="30%">
        <el-form
          size="medium"
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
           <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo('editFormRef')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色弹框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialog"
        class="setRoleDialog"
        @close="closeSetRoleDialog()"
        width="30%">
        <div>
          <p>当前用户：{{userInfo.username}}</p>
          <p>当前角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { users, putState, addUser, userInfo, editUserInfo, deleteUser, rolesList, updateUser } from '@/api/api'
export default {
  name: 'Users',
  props: {},
  components: {},
  data () {
    return {
      params: {
        query: null,
        pagenum: 1, // 页码
        pagesize: 10 // 每页显示条数
      },
      usersList: [],
      loading: true,
      dialogVisible: false, // 控制添加用户对话框显示与隐藏
      editDialog: false, // 控制修改用户对话框
      setRoleDialog: false, // 控制分配角色对话框
      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: { // 修改用户的表单数据
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      addFormRules: { // 添加用户的表单验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ]
      },
      userInfo: {}, // 需要被分配角色用户信息
      rolesList: [], // 角色列表
      selectRoleId: '' // 选中的id值
    }
  },
  created () {
    this.getUsers()
  },
  methods: {

    // 获取用户列表
    getUsers () {
      users(this.params).then(res => {
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: '获取用户列表失败'
          })
          this.loading = false
          return
        }
        this.usersList = data.data
        this.loading = false
        console.log(data)
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },

    // 设置序号
    indexMethod (index) {
      if (this.params.pagenum === 1) {
        return index + 1
      } else {
        return this.params.pagenum + '' + (index + 1)
      }
    },

    // 改变状态
    changeState (e) {
      putState(e.id, e.mg_state).then(res => {
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: '状态修改失败'
          })
          this.loading = false
          return
        }
        this.$message({
          message: '状态修改成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
      })
    },

    // 每页数据条数
    handleSizeChange (val) {
      this.loading = true
      this.params.pagesize = val
      this.params.pagenum = 1
      this.getUsers()
    },

    // 页码改变
    handleCurrentChange (val) {
      this.loading = true
      this.params.pagenum = val
      this.getUsers()
    },

    // 搜索
    search () {
      this.loading = true
      this.params.pagenum = 1
      this.getUsers()
    },

    // 清空输入框
    clear () {
      this.params.pagenum = 1
      this.getUsers()
    },

    // 确定新增用户
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { // 表单验证成功，调接口添加用户
          console.log(this.addForm)
          addUser(this.addForm).then(res => {
            const { data } = res
            if (data.meta.status !== 201) {
              this.$message({
                message: '添加用户失败'
              })
              return
            }
            this.dialogVisible = false
            this.$message({
              message: '添加用户成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '添加用户失败'
            })
          })
        } else {
          return false
        }
      })
    },

    // 弹窗关闭 重置表单
    closeForm (formName) {
      this.$refs[formName].resetFields()
    },

    // 修改用户信息弹窗显示
    showEditDialog (id) {
      this.editDialog = true
      console.log(id)
      userInfo(id).then(res => {
        const { data } = res
        console.log(data)
        if (data.meta.status !== 200) {
          return
        }
        this.editForm = data.data
      }).catch(err => {
        console.log(err)
      })
    },

    // 修改用户信息
    editUserInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { // 表单验证成功，调接口修改用户信息
          editUserInfo(this.editForm).then(res => {
            const { data } = res
            if (data.meta.status !== 200) {
              this.$message({
                message: '修改用户信息失败'
              })
              return
            }
            this.editDialog = false
            this.getUsers() // 重新获取数据列表（更新数据）
            this.$message({
              message: '修改用户信息成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '修改用户信息失败'
            })
          })
        } else {
          return false
        }
      })
    },

    // 删除用户
    deleteUser (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          const { data } = res
          if (data.meta.status !== 200) {
            this.$message({
              message: '删除失败'
            })
            return
          }
          this.getUsers() // 重新获取数据列表（更新数据）
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 展示分配角色对话框
    setRole (userInfo) {
      this.userInfo = userInfo
      // 获取角色列表
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
      this.setRoleDialog = true
    },

    // 分配角色弹框点击确定
    saveRoleInfo () {
      if (!this.selectRoleId) {
        this.$message({
          message: '请选择新角色'
        })
        return
      }
      updateUser(this.userInfo.id, this.selectRoleId).then(res => {
        const { data } = res
        this.setRoleDialog = false
        if (data.meta.status !== 200) {
          this.$message({
            message: '分配角色失败'
          })
          return
        }
        this.$message({
          type: 'success',
          message: '分配角色成功'
        })
        this.getUsers()
      }).catch(() => {

      })
    },

    // 监听分配角色对话框关闭事件
    closeSetRoleDialog () {
      this.selectRoleId = ''
      this.userInfo = []
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.setRoleDialog{
  text-align: left;
}
</style>
