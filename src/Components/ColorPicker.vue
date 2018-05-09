<template>
	<div class="colorpicker">
		<swiper :options="swiperOption" ref="mySwiper">
			<!-- slides -->
		    <swiper-slide>
		    	<ColorButton
					v-for="(color, index) in palette"
					:key="index"
					v-bind:index="index" 
					v-bind:color="color"
					v-bind:selected="selectedColor == index"
					v-on:toggle="toggleButton(index)"></ColorButton>
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
		},
		selectedColor: {
			type:Number,
			default:0
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
	methods: {
		toggleButton: function (index) {
			this.$emit("setColor", index);
		}
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
	width: 100%;
	height: 60px;
	overflow: none;
}
</style>