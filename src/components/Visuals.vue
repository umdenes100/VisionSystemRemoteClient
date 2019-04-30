<template>
	<div class="container">
		<div class="card w-100">
			<img v-bind:src="videoStream">
			<!-- TODO: OnError message -->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Visuals',
		data() {
			return {
				videoStream: "http://192.168.1.2:8080/"
			}
		}
	}
</script>

<style scoped>
	img {
		width: 100%;
		height: auto;
	}
</style>