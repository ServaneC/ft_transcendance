<template>
  <div v-if="state !== 'none'">
    <div :class="`you-${state}`">
        <img v-if="state === 'winner'" class="state-icon" src="@/assets/winner-icon.png" />
        <img v-else class="state-icon" src="@/assets/loser-icon.png" />
        <Avatar :class="`player-${state}-img`" :user="you" />
    </div>
    <h1 v-if="state === 'winner'"> You Won !</h1>
    <h1 v-else> You Lost :(</h1>
    <div :class="`other-${state}`"> 
      <div :class="`other-content-${state}`">
        <Avatar :user="other" />
        <router-link class="profile-link" :to="'/users/' + other.id">
          <h2>{{ other.userName }}</h2>
        </router-link>
      </div>
      <div class="other-state">
        <h3 v-if="state === 'loser'">Won !</h3>
        <h3 v-else>Lost</h3>
      </div>
    </div>
  </div>
  <div v-else>
    <h2>Winner</h2>
    <div class="none-winner">
      <img class="state-icon" src="@/assets/winner-icon.png" />
      <div class="other-content-loser">
        <Avatar :user="winner" />
        <router-link class="profile-link" :to="'/users/' + winner.id">
          <h2>{{ winner.userName }}</h2>
        </router-link>
      </div>
    </div>
    <h2>Loser</h2>
    <div class="none-loser">
      <img class="state-icon" src="@/assets/loser-icon.png" />
      <div class="other-content-winner">
        <Avatar :user="loser" />
        <router-link class="profile-link" :to="'/users/' + loser.id">
          <h2>{{ loser.userName }}</h2>
        </router-link>
      </div>
    </div>
  </div>
  <router-link to="/Play">
      <button class="back-game">Back to Game Page</button>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import User from "@/types/User";
import Avatar from "../users/Avatar.vue";

export default defineComponent({
  name: "Game Finished",
  components: {
    Avatar,
  },
  props: {
    winner: {
      type: Object as () => User,
      required: true,
    },
    loser: {
      type: Object as () => User,
      required: true,
    },
  },
  data() {
    return {
        state: "" as string,
        you: {} as User,
        other: {} as User,
    }
  },
  mounted() {
      if (this.winner.id === Number(localStorage.getItem("user-id"))) {
        this.state = "winner";
        this.you = this.winner;
        this.other = this.loser;
      }
      else if (this.loser.id === Number(localStorage.getItem("user-id"))) {
          this.state = "loser";
          this.you = this.loser;
          this.other = this.winner;
      }
      else {
        this.state = "none";
      }
  },
});
</script>

<style scoped>
[class|="player"] {
  width: 100px;
  height: 100px;
  border: 5px solid;
  border-radius: 100%;
}
.player-winner-img {
  border-color: #11bf1d;
}
.player-loser-img {
  border-color: red;
}
.state-icon {
  height: 100px;
  margin-right: 5%;
}

[class|="other"] {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
/* [class|="other-content"] {
} */

[class|="other-content"] img {
  width: 50px;
  height: 50px;
  border: 5px solid;
  border-radius: 100%;
  margin: 5px;
}
.other-content-winner img {
  border-color: red;
}
.other-content-loser img {
  border-color:  #11bf1d;
}
.profile-link {
  color: #2c3e50;
  font-weight: bold;
  text-decoration: none;
  font-size: 18px;
  align-content: center;
  margin: 5px;
}
.other-state {
  margin: 5px;
}
[class|="none"] {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.back-game {
  margin: 50px;
}
</style>
