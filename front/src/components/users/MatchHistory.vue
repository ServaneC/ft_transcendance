<template>
  <div class="matches-wrapper">
    <h3>Match History</h3>
    <div v-if="matches.length && players.length">
      <ul class="matches-list">
        <li
          v-for="(match, index) in matches"
          :key="match.matchId"
          class="matches-item"
        >
            <div :class="`block-user-one ${getMeClass(match.playerOne)} ${getWinnerClass(match.scorePlayerOne, match.scorePlayerTwo)}`">
              <div class="player-avatar">
                <Avatar v-if="match.playerOne === user.id" :user="user" />
                <Avatar v-else :user="players[index]" />
              </div>
              <div class="player-info-one">
                <p v-if="match.playerOne === user.id">{{ user.userName }}</p>
                <router-link v-else class="profile-link" :to="'/users/' + players[index].id">
                  <p>{{ players[index].userName }}</p>
                </router-link>
                <h4>{{ match.scorePlayerOne }}</h4>
              </div>
            </div>
            <div class="separator">-</div>
            <div :class="`block-user-two ${getMeClass(match.playerTwo)} ${getWinnerClass(match.scorePlayerTwo, match.scorePlayerOne)}`">
              <div class="player-info-two">
                <p v-if="match.playerTwo === user.id">{{ user.userName }}</p>
                <router-link v-else class="profile-link" :to="'/users/' + players[index].id">
                  <p>{{ players[index].userName }}</p>
                </router-link>
                <h4>{{ match.scorePlayerTwo }}</h4>
              </div>
              <div class="player-avatar">
                <Avatar v-if="match.playerTwo === user.id" :user="user" />
                <Avatar v-else :user="players[index]" />
              </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No matches :(</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import User from "@/types/User";
import Match from "@/types/Match";
import Avatar from "@/components/users/Avatar.vue";

export default defineComponent({
  name: "users-matches",
  components: {
    Avatar,
  },
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
    matches: {
      type: Object as () => Match[],
      required: true,
    },
    players: {
      type: Object as () => User[],
      required: true,
    }
  },
  methods: {
    getWinnerClass(scoreOne: number, scoreTwo: number): string {
      if (scoreOne > scoreTwo)
        return "winner";
      return "loser";
    },
    getMeClass(playerId: number): string {
      if (playerId === this.user.id)
        return "me-player";
      return "";
    }
  },
});
</script>

<style scopped>
.matches-wrapper {
  display: flex;
  flex-direction: column;
  width: 350px;
}
.matches-wrapper h3 {
  font-size: 20px;
}
.matches-list {
  list-style: none;
  padding: 0px;
  max-height: 300px;
  overflow-y: auto;
}
.matches-item {
  display: flex;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: space-between;
  margin: 3px;
  width: 98%;
}
.matches-item p {
  margin: 0;
  padding: 3px;
  border-radius: 10%;
}
.matches-item h4 {
  margin: 0;
  font-size: 1.2em;
}
.player-avatar {
  margin: 5px;
  /* width: 50px; */
}
.matches-item img {
  border: 2px solid #ddd;
  border-radius: 100%;
  width: 50px;
  height: 50px;
}
[class|="block-user"] {
  display: flex;
  width: 100%;
}
.block-user-two {
  display: flex;
  justify-content: flex-end;
}
[class|="player-info"] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}
.me-player p {
  font-weight: bold;
  font-size: 18px;
}
.winner.me-player img {
  border-color: #11bf1d;
}
.loser.me-player img {
  border-color: red;
}
.profile-link {
  color: black;
  text-decoration: none;
  align-content: center;
  font-size: 16px;
}
</style>