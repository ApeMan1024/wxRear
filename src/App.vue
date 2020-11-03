<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {mapMutations} from "vuex"
export default {
  name: 'App',
  async created(){
     let { data: res } = await this.$http.post("/pdrouter");
     if(!res){
        return await this.editBool();
     }
     await this.editBool("root");
  },
  methods:{
    ...mapMutations(["editBool"])
  }
}
</script>
