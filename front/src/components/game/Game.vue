<template>
	<div>
    	<div v-if="state === 'loading'">Loading...</div>
    	<div v-if="state === 'loaded'">
			<GameHeader :player1="player1" :player2="player2" />
			<canvas id="game-canvas"></canvas>
			<h1>&#8593; W  &#8595; S</h1>
			<RuleSet />
		</div>
    	<div v-if="state === 'finished'">
			<h1>Match done</h1>
			<div v-if="player1Score > player2Score">
				<GameFinished :winner="player1" :loser="player2" />
			</div>
			<div v-else>
				<GameFinished :winner="player2" :loser="player1" />
			</div>
    	</div>
  	</div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
import { Game } from "./classes/Game";
import { GameOptionsInterface } from "@/types/Game"
import Match from "@/types/Match"
import MatchDataService from "@/services/MatchServices"
import io from "socket.io-client";
import ResponseData from "../../types/ResponseData";
import UserDataService from "../../services/UserDataService";
import User from "@/types/User";
import GameFinished from "@/components/game/GameFinished.vue";
import GameHeader from "@/components/game/GameHeader.vue";
import RuleSet from "@/components/game/ruleset.vue";

const socket = io("http://localhost:3000", {
	auth: {
		token: localStorage.getItem('user-token'),
		userId: localStorage.getItem('user-id'),
		page: "game",
	}
});

export default defineComponent({
	name: "game",
	data() {
    	return {
			uuid: {} as number,
			match: {} as Match,
			player1Score: {} as number,
			player2Score: {} as number,
			game: {} as Game,
			gameOptions: {} as GameOptionsInterface,
			state: 'loading' as string,
			playerSide: "spectate" as string,
			player1: {} as User,
			player2: {} as User,
    	};
  	},
	components: {
		GameFinished,
		GameHeader,
		RuleSet,
	},
	watch : {
		'$route': {
			handler: function() {
				socket.emit("playerLeaveMatch", this.uuid);
				socket.offAny();
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		async getPlayer1(playerId: number) {
			await UserDataService.get(playerId)
			.then((response: ResponseData) => {
				this.player1 = response.data;
			});
		},
		async getPlayer2(playerId: number) {
			await UserDataService.get(playerId)
			.then((response: ResponseData) => {
				this.player2 = response.data;
			});
		},

		async loadData() {
			this.uuid = Number(this.$route.params.id);
			console.log(`game uuid : ${this.uuid}`);
			await MatchDataService.get(this.uuid)
			.then((response: ResponseData) => {
				this.match = response.data;
				if (!this.match) {
					console.log("ERROR: match not found !");
					this.$router.push("/Play");
				}

				if (this.match.playerOne === Number(localStorage.getItem('user-id')))
					this.playerSide = 'left';
				else if (this.match.playerTwo === Number(localStorage.getItem('user-id')))
					this.playerSide = 'right';
				this.getPlayer1(this.match.playerOne);
				this.getPlayer2(this.match.playerTwo);
				this.state = 'loaded';

				this.player1Score = this.match.scorePlayerOne;
				this.player2Score = this.match.scorePlayerTwo;

				if (this.player1Score >= 5 || this.player2Score >= 5)
					this.state = "finished";

				socket.on(`startGame${this.uuid}`, (payload) => {
					this.gameOptions = payload;
					console.log(`game started !!!`);
					this.game = new Game(socket, this.gameOptions, this.uuid, this.playerSide, String(localStorage.getItem('user-id')));
				});

				socket.on(`updateGame`, (payload) => {
					if (this.game) {
						this.player1Score = payload.player1.score;
						this.player2Score = payload.player2.score;
						if (this.player1Score >= 5 || this.player2Score >= 5) 
							this.state = "finished";
						if (this.state !== "finished")
							this.game.updateGame(payload);
					}
				});
				
				socket.emit("playerReady", this.uuid);
				console.log(`match loaded | uuid : ${this.match.matchId}\nplayer side : ${this.playerSide}`);
			});
		},
	},
    mounted() {
		this.loadData();
	},
	beforeDestroy() {
		console.log("before destroy");
		socket.offAny();
	},
});
</script>
