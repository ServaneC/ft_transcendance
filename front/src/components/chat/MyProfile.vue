<template>
  <div class="container">
    <div class="welcome-user">
      <h2>
        Welcome to the chat {{ this.user.userName }}
      </h2>
      <Avatar :user="this.user" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";

import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import Avatar from "@/components/users/Avatar.vue";

export default defineComponent({
    // 1: selectionner son utilisateur parmi la liste des user crées.

    name: "owner-profile",
    components: {
        Avatar,
    },
    props: {
        user: {
            type: Object as () => User,
            required: true,
        },
    },
});
</script>

<style scoped>
.container img {
    width: 64px;
    height: 64px;
}
.welcome-user img {
    width: 128px;
    height: 128px;
}
.select-user {
  display: flex;
  justify-content: center;
}
ul {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 50%;
}
li {
  list-style: none;
  display: flex;
  margin: 5px;
  align-items: center;
}
button {
  display: flex;
  align-items: center;
}
</style>
