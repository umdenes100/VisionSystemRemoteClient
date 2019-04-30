<template>
	<div class="container-fluid">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<span v-html="html"></span>
			</div>
			<div class="col-md-1">
				<form class="sticky" method="get" action="https://github.com/umdenes100/VisionSystemSimulatorInstallers/raw/master/VisionSystemSimInstaller.exe">
				<button type="submit" class="btn btn-primary">Windows Download</button>
				</form>
			</div>
			<div class="col-md-1">
				<form class="sticky" method="get" action="https://github.com/umdenes100/VisionSystemSimulatorInstallers/raw/master/VisionSystemSim.dmg">
				<button type="submit" class="btn btn-primary">Mac Download</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import showdown from 'showdown'

	export default {
		name: 'Simulator',
		data() {
			return {
				html: null,
				markdown: null,
			}
		},
		created() {
			const vm = this;
			var url = "https://raw.githubusercontent.com/umdenes100/VisionSystemSimulatorInstallers/master/README.md";
			
			axios.get(url)
				.then(function(response){vm.markdown = response.data})
				.then(vm.markdownToHtml);
		},
		methods: {
			markdownToHtml: function() {
				var converter = new showdown.Converter({tables: true}),
					text = this.$data.markdown,
					html = converter.makeHtml(text);
				this.$data.html = html;
			}
		}
	}
</script>

<style>
	img {
		max-width: 100%;
		height: auto;
	}
</style>
