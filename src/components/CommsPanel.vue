<template>
	<div class="container-fluid">
		<div class="row">
			<div class="card w-50">
				<div class="dropdown">
					<button class="btn btn-light btn-block dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Select Team Here
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#"
						v-for="(ttyUSB, key) in portList.CONTENT" :key="ttyUSB.id"
						v-on:click="sendOpenSwitch(key)">
							{{ ttyUSB.NAME }}
						</a>
					</div>
				</div>
			</div>
			<div class="card w-50">
				<button type="button" class="btn btn-light btn-block"
				v-on:click="sendSoftClose()">
					Clear
				</button>
			</div>
		</div>
		<div class="row">
			<div class="card w-50">
				<button type="button" 
				v-bind:class="[btn, debug ? activeClass : inactiveClass, btnblock]"
				v-on:click="toggleDebug()">
					Show Debug Messages
				</button>
			</div>
			<div class="card w-50">
				<button type="button" 
				v-bind:class="[btn, autoscroll ? activeClass : inactiveClass, btnblock]"
				v-on:click="toggleAutoscroll()">
					Autoscroll
				</button>
			</div>
		</div>
		<div class="row" id="debugCard" style="height: 500px; overflow-y: scroll;">
			<div class="card w-100">
				<pre> {{ debugMessage }} </pre>
			</div>
		</div>
		<div class="row">
			<div class="col-md-11">
				<p id="timer"> Timer: {{ printTime }} </p>
			</div>
			<div class="col-md-1">
				<font-awesome-icon id="missionIcon" :icon="icon" />
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CommsPanel',
		data() {
			return {
				message: [],
				portList: [],
				opened: false,
				oldPort: [],
				debugMessage: "",
				debug: true,
				autoscroll: true,
				activeClass: 'btn-primary',
				inactiveClass: 'btn-light',
				startRecieved: false,
				startTime: 0,
				currentTime: 0,
				printTime: "--:--",
				btn: 'btn',
				btnblock: 'btn-block',
				icon: '',
			}
		},
		created () {
			this.$options.sockets.onmessage = (data) => this.messageReceived(data);
			document.addEventListener('beforeunload', this.onClose)
		},
		methods: {
			messageReceived: function(rawMessage){
				var obj = JSON.parse(rawMessage.data);
				if(obj.TYPE == "PORT_LIST"){
					this.$data.portList = obj;
				}
				if(obj.TYPE == "START"){
					this.$data.debugMessage = "Started\n";
					this.$data.startRecieved = true;
					this.$data.startTime = obj.CONTENT;
				}
				if(obj.TYPE == "DEBUG" && this.$data.debug == true && this.$data.startRecieved == true){
					this.$data.debugMessage = this.$data.debugMessage + obj.CONTENT;
					if(this.$data.autoscroll == true){
						var objDiv = document.getElementById("debugCard");
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				}
				if(obj.TYPE == "TIME" && this.$data.startRecieved == true)
				{
					this.$data.currentTime = obj.CONTENT - this.$data.startTime;
					var minutes = Math.floor(this.$data.currentTime / 60);
					var seconds = this.$data.currentTime % 60;
					this.$data.printTime = "" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "";
				}
			},
			sendOpenSwitch: function(port){
				var obj;
				if(this.$data.opened == false){
					this.$data.opened = true;
					obj = {
						TYPE: "OPEN", 
						PORT: port,
					};
				}
				else{
					obj = {
						TYPE: "SWITCH",
						PORT: this.$data.oldPort,
						NEW_PORT: port,
					};
				}
				this.$data.oldPort = port;
				var myJSON = JSON.stringify(obj);
				this.$socket.send(myJSON);

				var mission = this.$data.portList.CONTENT[port].MISSION;
				if (mission == "BLACK_BOX") {
					this.$data.icon = "cube";
				} else if (mission == "CHEMICAL") {
					this.$data.icon = "vial";
				} else if (mission == "DEBRIS") {
					this.$data.icon = "campground";
				} else if (mission == "FIRE") {
					this.$data.icon = "fire-alt";
				} else if (mission == "WATER") {
					this.$data.icon = "water";
				}
			},
			sendSoftClose: function(){
				var obj = {
					TYPE: "SOFT_CLOSE",
					PORT: this.$data.oldPort,
				}
				var myJSON = JSON.stringify(obj);
				this.$socket.send(myJSON);
			},
			handler: function onClose() {
				var obj = {
					TYPE: "HARD_CLOSE",
					PORT: this.$data.oldPort,
				}
				var myJSON = JSON.stringify(obj);
				this.$socket.send(myJSON);
			},
			toggleDebug: function(){
				this.$data.debug = !this.$data.debug;

			},
			toggleAutoscroll: function(){
				this.$data.autoscroll = !this.$data.autoscroll;
			},
		}
	}

</script>

<style scoped>
	button {
		font-family: 'Lato';
	}
	label {
		font-family: 'Lato';
		font-size: 16px;
		text-align: center;
	}
	#timer {
		font-family: 'Lato';
		color: black;
		font-size: 24px;
	}
	#missionIcon {
		font-size: 40px;
	}
</style>