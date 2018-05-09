<template>
	<div class="colorpicker">
		<swiper :options="swiperOption" ref="mySwiper">
			<!-- slides -->
		    <swiper-slide>
		    	<ColorButton
					v-for="(color, index) in palette"
					:key="index"
					v-bind:index="index" 
					v-bind:color="color"></ColorButton>
		    </swiper-slide>	
		    <!-- Optional controls -->
		    <!--<div class="swiper-pagination"  slot="pagination"></div>
		    <div class="swiper-button-prev" slot="button-prev"></div>
		    <div class="swiper-button-next" slot="button-next"></div>
		    <div class="swiper-scrollbar"   slot="scrollbar"></div>-->
	    </swiper>
	</div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ColorButton from "./ColorButton.vue";

export default {
	props:{
		palette: {
			type: Array,
			default: function () { return []; }
		}
	},
	data: function () {
		return {
			swiperOption: {

			}
		}
	},
	computed: {
		swiper() {
			return this.$refs.mySwiper.swiper
		}
    },
	created: function () {
		console.log(this.palette);
	},
	mounted: function () {
      	//this.swiper.slideTo(3, 1000, false)
	},
	components: {
		ColorButton,
		swiper,
    	swiperSlide
	}
}
</script>

<style>
.colorpicker {
	position: absolute;
	bottom:0px; left:0px;
	background-color:#ff00FF;
	width: 100%;
	height: 50px;
	padding:0px 5px;
	overflow: none;
}
</style>