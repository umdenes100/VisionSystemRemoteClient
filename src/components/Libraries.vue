<template>
	<div id="container" class="container-fluid">
		<h1>Libraries</h1>
		<p> Downloads and documentation for the various libraries we use in class. </p>
		<div id="libDiv" v-for="(lib, key) in librariesList" :key="lib.id">
			<h2 id="name" v-on:click="switchLib(lib, key)">
				{{ lib }} {{ down[key] }}
			</h2>
			<Library id="libComponent" v-bind:libraryName=lib v-if="currentLib == lib"></Library>
		</div>
	</div>
</template>

<script>
	import Library from './Library.vue';
	export default {
		name: 'Libraries',
		components: {
			Library,
		},
		data() {
			return {
				librariesList: ['ENES100', 'Simulator', 'Tank'],
				currentLib: "",
				down: [],
			}
		},
		created () {
			var i = 0;
			for(; i < this.$data.librariesList.length; i++) {
				this.$data.down[i] = "⯈";
			}
		},
		methods: {
			switchLib: function(lib, key) {
				if(this.$data.currentLib == lib) {
					this.$data.currentLib = "";
					this.$data.down[key] = "⯈";
					return(0);
				}
				else {
					this.$data.currentLib = lib;
					this.$data.down[key] = "⯆";
				}
				var i = 0;
				for(; i < this.$data.librariesList.length; i++) {
					if(key != i) {
						this.$data.down[i] = "⯈";
					}
				}
			}
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Fjalla+One|Lato');
	#libDiv {
		background-color: #f5f5ff;
		border-top: solid 2px #ffffff;
		border-radius: 10px;
		margin: 8px;
		padding: 4px;
	}
	#libComponent {
		padding: 8px 20px;
		background-color: #eeeeff;
		position: relative;
		z-index: 100;
		box-shadow: inset 0 0 20px #cccccc;
		border-radius: 10px;
	}

	h1 {
		font-family: 'Lato';
		color: black;
		text-decoration: none;
		font-size: 36px;
	}
	h2 {
		font-family: 'Lato';
		color: black;
		text-decoration: none;
		font-size: 24px;
	}
	#name {
		font-family: 'Lato';
		color: black;
		text-decoration: none;
		font-size: 24px;
		cursor: pointer;
	}
	p {
		font-family: 'Lato';
		color: black;
	}
</style>