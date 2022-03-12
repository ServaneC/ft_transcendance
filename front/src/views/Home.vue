<template>
  <div class="home">
    <img alt="Pong logo" src="@/assets/pong_logo.png" />
  </div>
  <div class="home-page">
    <div class="pong-presentation">
      <h2>What's Pong ?</h2>
      <img src="@/assets/original-pong.png" />
        <p>If you are living under a rock or very young, you might not know what Pong is.</p>
        <p>
          Pong is a table tennis–themed arcade sports video game, manufactured by Atari and originally released in 1972.
          It was one of the earliest arcade video game ! It was created by Allan Alcorn as a training exercise assigned 
          to him by Atari co-founder Nolan Bushnell. Pong was the first commercially successful video game, 
          and it helped to establish the video game industry !
        </p>
        <p>
          Pong is a two-dimensional sport game that simulates table-tennis. The player controls an in-game paddle 
          by moving it vertically across the left or right side of the screen. They can compete against another 
          player controlling a second paddle on the opposing side. Players use the paddles to hit a ball back and forth. 
          The goal is for each player to reach eleven points before the opponent, points are earned when one fails 
          to return the ball to the other.
        </p>
    </div>
    <div class="our-pong">
      <h2>Ok, nice history lesson but what's is this website for ?</h2>
      <p>On this website, we've tried our best to reproduce the same pong from 1972!
        Because it can be nice sometimes to discover or re-discover the first video game, 
        it's a piece of history after all !
      </p>
      <p>
        But because sometime we don't have time for an eleven point game, You can choose in how many 
        points to play the game. To move your paddle up, use the [W] key and [S] key to move down, 
        simple as that ! You can ask another player to play with you or wait in a queue and 
        be match with another random user waiting to play !
      </p>
      <router-link to="/Play">
        <button>Start Playing</button>
      </router-link>
    </div>
    <div class="chat-presentation">
      <h2>Because we are not in 1972 anymore, we added a chat !</h2>
      <p>You can chat with other users either in public channels, private channels or with direct messages !</p>
      <router-link to="/chat">
        <button>Got to the Chat Page</button>
      </router-link>
    </div>
    <div class="friend-presentation">
      <h2>Ok nice, what else ?</h2>
      <p>You can add other users as friend to find them more easily. Your friend list is at the bottom of your profile !</p>
      <router-link to="/users">
        <button>Go look for a friend</button>
      </router-link>
      <router-link to="/profile">
        <button>Check out your friends List</button>
      </router-link>
    </div>
    <div class="block-presentation">
      <h2>What if someone is bothering me ?</h2>
      <p>If someone is bothering you so much you can't bear to see them anymore, you can block them! 
        Go to their profile and look for the 'Block' button. 
        If you change your mind, you can always unblock someone: look for the drop-down list "blocked users" around your friends list on your profile.</p>
    </div>
    <div class="end-statement">
      <h2>Have fun !</h2>
      <p>Our goal is to create a safe place to take a break from your day and play a match of pong or chat with other users !</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from "socket.io-client";
import SocketServices from "../services/SocketServices"
const socket = io("http://localhost:3000", {
	auth: {
		token: localStorage.getItem('user-token'),
		userId: localStorage.getItem('user-id'),
		page: "home"
	}
});


export default defineComponent({
	watch : {
		'$route': {
			handler: function() {
				socket.offAny();
			},
			deep: true,
			immediate: true,
		},
	},
  mounted() {
		SocketServices.connectGlobalSocketNotif(socket);
	},
});
</script>

<style scoped>
.home img {
  width: 30%;
  height: auto;
}
.pong-presentation {
  width: 70%;
}
.pong-presentation img {
  float: left;
  object-fit: contain;
  border: white 1px solid;
  margin: 10px;
}
.home-page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.home-page div {
  border-radius: 10px;
  opacity: 0.9;
  font-weight: bold;
  margin: 15px;
  padding: 15px;
  background-color: black;
  color: white;
}
.home-page div:hover {
  opacity: 1;
}

.our-pong {
  width: 80%;  
}
.chat-presentation {
  width: 25%;
}
.friend-presentation {
  width: 25%;

}
.block-presentation {
  width: 25%;
}
</style>
