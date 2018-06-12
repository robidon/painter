<template>
	<div class="color-button-container"><div class="color-button" v-on:click="toggle" v-bind:class="{ selected:selected }" :style="{ backgroundColor: cssBColor, color:cssFColor }" >{{ !complete ? index+1 : '🗸' }}</div></div>
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
		},
		complete: {
			type:Boolean,
			default: false
		}
	},
	computed: {
		cssBColor: function () {
			return this.color.toHexString();
		},
		cssFColor: function () {
			let c = this.color.clone();
			if (c.isLight()) {
				return c.darken(40).toHexString();
			} else {
				return c.lighten(40).toHexString();
			}
			//return this.color.clone().lighten(40).toHexString();	
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
	display: block;
	font-family: Verdana;
	font-size:18px;
	color: #a7a7a7;
	margin: 5px;
	width: 44px;
	height: 44px;
	position: relative;
	text-align: center;
	line-height: 44px;
	border-radius: 50%;
	box-shadow: 0px 6px 16px #fff, inset 0px 20px 30px #fff5;
	-webkit-box-shadow: 0px 6px 16px #fff, inset 0px 20px 30px #fff5;
	-moz-box-shadow: 0px 6px 16px #fff, inset 0px 20px 30px #fff5;

	-webkit-touch-callout:none;
	-webkit-user-select:none;
	-khtml-user-select:none;
	-moz-user-select:none;
	-ms-user-select:none;
	user-select:none;
	-webkit-tap-highlight-color:rgba(0,0,0,0);
}
.color-button-container {
	position: relative;
	display: inline-block;
}
.color-button.selected {
	width:54px;
	height:54px;
	line-height: 54px;
	margin:0px;
}
</style>