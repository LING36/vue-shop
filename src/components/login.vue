<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form
        label-width="0px"
        class="login-form"
        :model="userData"
        :rules="rules"
        ref="loginFromRef"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="用户名"
            prefix-icon="iconfont icon-user-name"
            v-model="userData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="iconfont icon-password"
            v-model="userData.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginOn" :disabled="loading">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/api'
export default {
  name: 'Login',
  props: {},
  components: {},
  data () {
    return {
      userData: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {},
  methods: {

    // 点击重置按钮，重置表单
    resetLoginFrom () {
      console.log(this.$refs)
      this.$refs.loginFromRef.resetFields()
    },
    // 点击登录
    loginOn () {
      this.loading = true
      this.$refs.loginFromRef.validate((valid, err) => { // 表单验证
        // err 验证失败的字段
        // valid 验证结果
        if (!valid) {
          this.loading = false
          return false
        }

        // 通过验证，请求登录
        login(this.userData).then(res => {
          const { data } = res
          console.log(data)
          this.loading = false
          if (data.meta.status !== 200) {
            this.$message.error(data.meta.msg)
            return
          }
          this.$message({
            message: '登录成功!',
            type: 'success'
          })
          localStorage.setItem('token', data.data.token)
          // 本地存储只能存储字符串
          // 存储对象或数组则把他们转为 JSON 格式字符串进行存储
          // JSON.stringify() 将数据转为JSON字符串
          // JSON.parse() 将JSON字符串还原为原来数据对象
          localStorage.setItem('user', JSON.stringify(data.data))
          this.$router.push('/home')
        }).catch(err => {
          this.loading = false
          console.log(err)
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
.login-container{
  background-color: #2b4b6b;
  height: 100%;
  .login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar-box{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .btns{
    display: flex;
    justify-content: center;
  }
  .login-form{
    position: absolute;
    bottom: 0;
    width: 80%;
    left: 50%;
    transform: translate(-50%,0);
  }
}
</style>
