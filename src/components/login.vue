<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form label-width="0px" class="login-form">
        <el-form-item>
          <el-input
            placeholder="用户名"
            prefix-icon="iconfont icon-yonghuming"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="密码"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {},
  components: {},
  data () {
    return {}
  },
  created () {},
  methods: {},
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
