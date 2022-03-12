<template>
  <div class="friends-list-div">
    <h3>Friends</h3>
    <div class="left-side-friend-list">
      <div v-if="users.length">
        <input
          type="text"
          placeholder="Search a friend.."
          v-model="keyword"
          @input="searchhandler"
          @change="searchhandler"
        />
      </div>
      <BlockedList />
    </div>
    <div v-if="users.length" class="friend-wrapper">
      <ul class="friend">
        <li class="friend-item" v-for="user in filteredUsers" :key="user.id">
          <div class="friend-img">
            <Avatar :user="user" />
          </div>
          <div class="friend-item-content">
            <router-link class="profile-link" :to="'/users/' + user.id">
              <p>{{ user.userName }}</p>
            </router-link>
          </div>
          <div class="user-status">
            <div v-if="user.inGame" id="ingame-circle"></div>
            <div v-else-if="user.isActive" id="online-circle"></div>
            <div v-else id="offline-circle"></div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You currently have no friends :(</p>
    </div>
  </div>
        <div>
        <router-link to="/users">
          <button class="users-link">Find New Friends</button>
        </router-link>
      </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import Avatar from "./Avatar.vue";
import BlockedList from "@/components/users/BlockedList.vue";


export default defineComponent({
  name: "users-friend",
  components: {
    Avatar,
    BlockedList,
  },
  data() {
    return {
      users: [] as User[],
      filteredUsers: [] as User[],
      keyword: "",
    };
  },
  methods: {
    retrieveusers() {
      UserDataService.getFriends(Number(localStorage.getItem("user-id")))
        .then((response: ResponseData) => {
          this.users = response.data;
          this.users.sort((a, b) => (a.userName > b.userName ? 1 : -1));
          this.filteredUsers = this.users;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    searchhandler() {
      this.filteredUsers = this.users.filter((user) =>
        user.userName.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
  },
  mounted() {
    this.retrieveusers();
  },
});
</script>

<style scopped>
.friends-list-div {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.friend-img img {
  width: 40px;
  height: 40px;
}
.friends-list-div h3 {
  font-size: 20px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.profile-link {
  color: black;
  text-decoration: none;
  font-size: 18px;
  align-content: center;
}
.friend-item {
  display: flex;
  border: 2px solid rgba(0, 0, 0, 0.1);
  margin: 5px;
  align-items: center;
  width: 155px;
}
.friend-item-content {
  width: 80px;
}
.friends-list-div input[type="text"] {
  padding: 6px;
}
.user-status {
  margin-left: auto;
  margin-right: auto;
}
.users-link {
  font-size: 14px;
  background-color: grey;
}
.friend-wrapper {
  max-width: 75%;
}
.friend-wrapper ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
}
</style>
