<template>
  <div v-if="user.userName" class="user-info-block">
    <div class="user-status">
      <h4>{{ user.userName }}</h4>
      <div class="friend-status" v-if="isFriend">Friend</div>
      <div v-if="user.inGame" id="ingame-circle"></div>
      <div v-else-if="user.isActive" id="online-circle"></div>
      <div v-else id="offline-circle"></div>
    </div>
    <div class="row">
      <div clas="column">
        <Avatar :user="user" />
      </div>
      <div clas="column">
        <div class="user-info">
          <p><i class='bx bxs-trophy'></i> {{ victories }}</p>
          <p><i class='bx bx-sad'></i> {{ losses }}</p>
          <p>Level: {{ user.ladderLevel }}</p>
          <br />
        </div>
      </div>
      <div class="row-bottom">
        <div clas="column">
          <AchievementsList :userId="user.id" />
        </div>
        <div clas="column">
          <MatchHistory :user="user" :matches="matches" :players="players" />
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import User from "@/types/User";
import Match from "@/types/Match";
import ResponseData from "@/types/ResponseData";
import UserDataService from "@/services/UserDataService";
import AchievementsList from "./AchievementsList.vue";
import MatchHistory from "./MatchHistory.vue";
import Avatar from "./Avatar.vue";

export default defineComponent({
  name: "User",
  components: {
    AchievementsList,
    MatchHistory,
    Avatar,
  },
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
    isFriend: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      matches: [] as Match[],
      players: [] as User[],
      victories: {} as number,
      losses: {} as number,
    };
  },
  methods: {
    async getMatches(id: number) {
      UserDataService.getMatchHistory(id)
        .then((response: ResponseData) => {
          this.matches = response.data.matches;
          this.players = response.data.players;
          this.victories = response.data.victories;
          this.losses = response.data.losses;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getMatches(this.user.id);
  },
});
</script>

<style scoped>
[class|="row"] {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
.row-bottom {
  gap: 50px;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.container > .top-container {
  background-color: turquoise;
}
.user-info {
  margin: 5%;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.user-info p {
  font-size: 25px;
  margin: 15px;
}
.user-status {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  align-items: center;
}
img {
  width: 300px;
  height: 300px;
  border: 5px solid #ddd;
  border-radius: 10px;
}
h4 {
  font-size: 30px;
  margin-right: 10px;
}
.friend-status {
  background-color: #4bbd4b;
  font-weight: bold;
  color: white;
  margin-right: 0%;
  padding: 5px;
  margin-right: 5px;
}
</style>
