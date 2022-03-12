<template>
  <div class="container">
    <div v-if="!userSelected">
      <h4>Selectionnez votre profil</h4>
      <div class="no-user-created">
        <h4 class="warning" v-if="this.users.length <= 0">
          No user found, create user first
        </h4>
      </div>
      <div class="select-user">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ active: index == currentIndex }"
            v-for="(user, index) in users"
            :key="index"
          >
            <button class="btn" name="button" @click="selectUser(user)">
              <Avatar :user="user" />
              {{ user.userName }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="welcome-user" v-else>
      <h3>
        Welcome {{ this.currentUser.userName }}
      </h3>
      <Avatar :user="this.currentUser" />
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
    data() {
        return {
            users: [] as User[],
            currentUser: {} as User,
            currentIndex: -1,
            userSelected: false,
        };
    },
    props: {
        method: { type: Function },
    },
    methods: {
        getUsers() {
            UserDataService.getAll()
            .then((response: ResponseData) => {
                this.users = response.data;
            })
            .catch((e: Error) => {
            });
        },
        refreshList() {
            this.currentUser = {} as User;
            this.currentIndex = -1;
            this.userSelected = false;
        },
        selectUser(user : User) {
            console.log("Select User: " + user.userName);
            this.currentUser = user as User;
            this.userSelected = true;
            this.$emit('getUserSelected', user);
        },
    },

    // Component Loaded
    mounted() {
        this.getUsers();
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
/*
.userChatInput {
    display: inline-block;
    width: 0 auto;
    height: 0 auto;
    margin: 2px black auto;
}
.userChatInput .btn {
    margin: 15px;
}
.userChatInput .btn-default {
    border: 2px solid black;
}
.select-user {
    display: inline-block;
    text-align: center;


    width: auto;
    height: auto;

    margin: 0 auto;
    padding: 0 auto;
}
.select-user button {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 42px;
    margin-top: 10px;
}

button img{
    width: 24px;
}
.welcome-User {
    position: relative;
    display: inline-block;
    margin: 0 auto;
    padding: 0 auto;
    width: 30em;
    text-align: center;
}
.welcome-User img {
    width: 12em;
}

.welcome-User strong {
    color: lightgreen;
}

.warning {
    color: orange;
}
*/
</style>
