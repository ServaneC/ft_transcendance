<template>
  <div class="achievements-wrapper">
    <h3>Achievements</h3>
    <div v-if="achievements.length">
      <ul class="achievements-list">
        <li
          v-for="achievements in achievements"
          :key="achievements.id"
          :class="`achievements-item-${achievements.class}`"
        >
          <div :class="`achievement-img-${achievements.class}`">
            <img
              :src="`http://localhost:3000/users/achievements/${achievements.class}`"
            />
          </div>
          <div class="achievements-info">
            <h4>{{ achievements.name }}</h4>
            <p>{{ achievements.description }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No achievements :(</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Achievements from "@/types/Achievements";
import UserDataService from "@/services/UserDataService";
import ResponseData from "@/types/ResponseData";

export default defineComponent({
  name: "users-achievements",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      achievements: [] as Achievements[],
    };
  },
  methods: {
    getAchievements(id: number) {
      UserDataService.getAchievements(id)
        .then((response: ResponseData) => {
          this.achievements = response.data;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getAchievements(this.userId);
  },
});
</script>

<style scopped>
.achievements-wrapper {
  display: flex;
  flex-direction: column;
  width: 350px;
}
.achievements-wrapper h3 {
  font-size: 20px;
}
.achievements-list {
  list-style: none;
  padding: 0px;
  max-height: 300px;
  overflow-y: auto;
}
[class|="achievements-item"] {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  margin: 3px;
}
[class|="achievement-img"] {
  width: 20%;
  max-width: 50px;
  padding: 15px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
[class|="achievement-img"] img {
  width: 40px;
  height: 40px;
}

.achievement-img-user {
  background-color: #e6c7ff;
}

.achievement-img-relation {
  background-color: #b3f4ff;
}
.achievement-img-game {
  background-color: #faffb3;
}
.achievement-img-chat {
  background-color: #bdffb3;
}

.achievements-info {
  text-align: initial;
  width: 100%;
  margin-left: 10px;
}
.achievements-info p {
  margin: 0.1em;
  font-size: 0.8em;
  color: #999;
}
.achievements-info h4 {
  margin: 0;
  font-size: 1.2em;
}
</style>
