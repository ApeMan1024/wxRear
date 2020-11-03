<template>
  <div class="dashboard-container">
    <div >博客访问量:<el-tag type="success">{{num}}</el-tag></div>
    <div class="dashboard-text">欢迎进入猿人博客后台管理系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data(){
    return {
      num:0
    }
  },
  async created(){
    await this.getBlogNum();
  },
  methods:{
    //获取博客的访问量
    async getBlogNum(){
      let {data:res}=await this.$http.post("/getblognum");
      if(res.code===403){
        let {path}=this.$route;
        sessionStorage.removeItem("token");
        this.$router(`/login?redirect=${path}`);
        return 
      }
      if(res.code===200){
        this.num=res.data.num
        return 
      }
      this.$message.error("获取博客访问量失败");
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
