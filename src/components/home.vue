<template>
  <div class="">
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
</style>
