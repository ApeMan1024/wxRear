import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  state:{
    bool:false
  },
  mutations:{
    editBool(state,username){
      if(username==="root"){
        state.bool=true;
        return ;
      }
      state.bool=false;
    }
  },
  getters
})

export default store
