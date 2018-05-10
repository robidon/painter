<template>
	<div class="color-button" v-on:click="toggle" v-bind:class="{ selected:selected }" :style="{ backgroundColor: cssBColor, color:cssFColor }" >{{ index+1 }}</div>
</template>

<script>

export default {
	props: {
		index: {
			type:Number
		},
		color: {
			type: Object,
			required: true
		},
		selected: {
			type:Boolean,
			default: false
		}
	},
	computed: {
		cssBColor: function () {
			return this.color.toHexString();
		},
		cssFColor: function () {
			return this.color.clone().lighten(40).toHexString();	
		}
	},
	methods: {
		toggle: function () {
			this.$emit('toggle');
		}
	}
}

</script>

<style>
.color-button {
	display: inline-block;
	font-family: Verdana;
	font-size:18px;
	color: #a7a7a7;
	/*background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f7f7), to(#e7e7e7));
	background-image: -webkit-linear-gradient(top, #f7f7f7, #e7e7e7); 
	background-image: -moz-linear-gradient(top, #f7f7f7, #e7e7e7); 
	background-image: -ms-linear-gradient(top, #f7f7f7, #e7e7e7); 
	background-image: -o-linear-gradient(top, #f7f7f7, #e7e7e7); */
	margin: 5px;
	width: 44px;
	height: 44px;
	position: relative;
	text-align: center;
	line-height: 44px;
	border-radius: 50%;
	box-shadow: 0px 3px 8px #aaa, inset 0px 2px 3px #fff;
}
.color-button.selected {
	width:54px;
	height:54px;
	line-height: 54px;
	margin:0px;
}
</style>