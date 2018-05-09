<template>
	<div id="app">
		<Game></Game>
	</div>
</template>

<script>
import Game from './Components/Game.vue'

export default {
	data: function () {
		return {
			greeting: 'Helasalo'
		}
	},
	components: {
		Game
	}
}

</script>

<style>
#app {
	background-color:#ff0000;
	min-height: 100%;
	min-width: 100%;
}
</style>