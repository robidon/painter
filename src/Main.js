import {initGame} from "./Game";
import Vue from "vue";
import App from './App.vue'
//initGame();

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})