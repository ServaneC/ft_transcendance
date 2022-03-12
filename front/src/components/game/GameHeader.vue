<template>
  <div class="game-header">
      <div :class="`box player-one ${isYou(player1.id)}`">
         <h1>{{ player1.userName }}</h1> 
          <Avatar :user="player1" />
      </div>
        <h1 class="box middle"><i class='bx bxs-zap'></i></h1>
      <div :class="`box player-two ${isYou(player2.id)}`">
          <Avatar :user="player2" />
         <h1>{{ player2.userName }}</h1> 

      </div>
  </div>
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
    player1: {
      type: Object as () => User,
      required: true,
    },
    player2: {
      type: Object as () => User,
      required: true,
    },
  },
  methods: {
      isYou(id: number): string | void {
          if (id === Number(localStorage.getItem("user-id")))
            return ("is-you");
      }
  },
  mounted() {
      console.log("game header");
  },
});
</script>

<style scoped>
.game-header {
    display: flex;
}

.player-two,
.player-one {
  flex: 1;
  display: flex;
  min-width: -webkit-min-content;
}
.game-header img {
    width: 64px;
    height: 64px;
    margin: 5px;
    border: 2px solid #ddd;
    border-radius: 100%;
}
.player-one {
  justify-content: flex-end;
  margin-right: 10px;
}
.player-two {
  justify-content: flex-start;
  margin-left: 10px;
}
.is-you {
    color: black;
}
.is-you img {
    border: 4px solid  black;
}
</style>