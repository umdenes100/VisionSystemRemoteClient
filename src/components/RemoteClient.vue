<template>
	<div class="container-fluid" id="RemoteClient">
		<div class="row">
			<div class="col-md-4">
				<CommsPanel></CommsPanel>
			</div>
			<div class="col-md-8">
				<Visuals></Visuals>
			</div>
		</div>
	</div>
</template>

<script>
	import CommsPanel from './CommsPanel.vue'
	import Visuals from './Visuals.vue'

	export default {
		name: 'RemoteClient',
		components: {
			CommsPanel, Visuals
		},
	}
</script>