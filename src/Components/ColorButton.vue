<template>
	<div class="color-button" :style="{ backgroundColor: cssColor }">{{ index+1 }}</div>
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
		}
	},
	computed: {
		cssColor: function () {
			return this.color.toHexString();
		}
	},
	data: function () {
		return {
			greeting: 'Hello'
		}
	}
}

</script>

<style>
.color-button {
	display: block;
	float: left;
	width:40px;
	height: 40px;
	background: #fff;
	margin:5px;
	border-radius: 20px;
	text-align: center;
	line-height: 40px;
	padding: 0px;
}
</style>