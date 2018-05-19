import Vue from "vue";
import Preloader from './Components/Preloader.vue'
Vue.component("preloader", Preloader);
import App from './App.vue'

window.globals = {
	images:[]
};

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})