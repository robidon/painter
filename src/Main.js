import Vue from "vue";
import App from './App.vue'

window.globals = {
	images:[]
};

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})