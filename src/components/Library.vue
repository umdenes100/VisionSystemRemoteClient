<template>
	<div class="container-fluid">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<span v-html="html"></span>
			</div>	
			<div class="col-md-1">
				<form class="sticky" method="get" v-bind:action="downloadUrl">
				<button type="submit" class="btn btn-primary">Download</button>
				</form>
				<!-- <a class="btn-download" v-bind:href="downloadUrl"> Download </a> -->
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import showdown from 'showdown'

	export default {
		name: 'Library',
		props: ['libraryName'],
		data() {
			return {
				html: null,
				markdown: null,
				downloadUrl: "",
			}
		},
		created() {
			const vm = this;
			var url = "https://raw.githubusercontent.com/umdenes100/" + this.$props.libraryName + "ArduinoLibrary/master/README.md";
			
			axios.get(url)
				.then(function(response){vm.markdown = response.data})
				.then(vm.markdownToHtml);
			this.$data.downloadUrl = "https://github.com/umdenes100/" + this.$props.libraryName + "ArduinoLibrary/archive/master.zip";
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