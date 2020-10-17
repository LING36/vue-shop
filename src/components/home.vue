<template>
  <div class="home-container">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {},
  components: {},
  data () {
    return {}
  },
  created () {},
  methods: {
    // 退出登录
    logout () {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.home-container, .el-container{
  height: 100%;
}
.el-header{
  background-color: #373d37;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #333744;
  color: #fff;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #eaedfe;
  color: #fff;
  text-align: center;
  line-height: 160px;
}
</style>
