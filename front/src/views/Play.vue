<template>
  	<div class="play" v-if="!inQueue">
    	<h1>&#8593; W  &#8595; S </h1>
    	<br />
			<button class="button" v-on:click="findMatch">Find a match</button>
			<button class="button" v-on:click="findMatchBonus">Find a match with bonus</button>
  	</div>
		<div class="queue" v-else>
			You are in the queue, a match will start as soon as we find another player
			<div id="loader">
          <div id="loader-wheel"></div>
      </div>
		</div>
		<RuleSet />
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
import io from "socket.io-client";
import SocketServices from "../services/SocketServices";
import RuleSet from "@/components/game/ruleset.vue";

const socket = io("http://localhost:3000", {
	auth: {
		token: localStorage.getItem('user-token'),
		userId: localStorage.getItem('user-id'),
		page: "play"
	}
});

export default defineComponent({
	data() {
    	return {
				inQueue: false as boolean,
    	};
	},
	components: {	
		RuleSet,
	},
	methods: {
		findMatch: function() {
			console.log("start matchmaking");
			this.inQueue = true;
			socket.emit('searchGame', false);
		},
		findMatchBonus: function() {
			console.log("start bonus matchmaking");
			this.inQueue = true;
			socket.emit('searchGame', true);
		}
	},
	watch : {
		'$route': {
			handler: function() {
				if (this.inQueue)
					socket.emit("playerLeaveMatchmaking");
				socket.offAny();
			},
			deep: true,
			immediate: true,
		},
	},
    mounted() {
		SocketServices.connectGlobalSocketNotif(socket);
		socket.on('matchFound', (uuid: string) => {
			console.log("match found | uuid : ", uuid);
			this.inQueue = false;
			this.$router.push("/game/" + uuid);
		});
	},
	beforeDestroy() {
		console.log("before destroy");
		socket.offAny();
	},
});
</script>

<style scoped>
.play {
	height: 300px;
}
.queue {
	height: 300px;
	display: flex;
	flex-direction: column;
  align-items: center;
  justify-content: space-evenly;;
}
img {
  max-width: 50%;
  height: auto;
}
canvas {
  background: #2e2d2d;
  display: block;
  margin: 0 auto;
}
.rule-set {
	margin-top: 50px;
}
</style>
