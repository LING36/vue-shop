<template>
  <div class="home-container">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="@/assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <!-- /头部 -->
      <el-container>
        <!-- 侧边菜单 -->
        <el-aside width="auto">
          <div class="fold" @click="isCollapse = !isCollapse">
            <i class="el-icon-s-fold" v-show="!isCollapse"></i>
            <i class="el-icon-s-unfold" v-show="isCollapse"></i>
          </div>
         <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            :unique-opened="true"
            :collapse="isCollapse"
            router
            :default-active="$route.path"
            >
            <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
              <template slot="title">
                <i :class="icons[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/' + children.path" v-for="children in item.children" :key="children.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{children.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- /侧边菜单 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { menus } from '@/api/api'
export default {
  name: 'Home',
  props: {},
  components: {},
  data () {
    return {
      menusList: [],
      icons: {
        125: 'iconfont icon-iconset0203',
        103: 'iconfont icon-moxing-miaobian',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    this.getmenus()
  },
  methods: {

    // 退出登录
    logout () {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },

    // 左侧菜单
    getmenus () {
      menus().then(res => {
        const { data } = res
        if (data.meta.status !== 200) {
          this.$message({
            message: data.meta.msg
          })
          return
        }
        this.menusList = data.data
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
    },

    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
  }
  span{
    padding: 0 10px;
  }
}

.el-aside {
  background-color: #333744;
  color: #fff;
  text-align: center;
  line-height: 200px;
  .el-menu{
    border: none;
  }
}

.el-main {
  background-color: #eaedfe;
  text-align: center;
  line-height: 160px;
}
.iconfont{
  margin-right: 10px;
}
ul li{
  text-align: left;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.fold{
  height: 50px;
  line-height: 50px;
  background-color: #4a5064;
  cursor: pointer;
}
</style>
