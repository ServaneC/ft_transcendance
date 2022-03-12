<template>
  <div class="list row">
    <div class="list-wrapper">
      <h3>Users List</h3>
      <input
        type="text"
        placeholder="Search an user..."
        v-model="keyword"
        @input="searchhandler"
      />
      <ul class="list">
        <li class="list-item" v-for="user in filteredUsers" :key="user.id">
          <div class="list-img">
            <Avatar :user="user" />
          </div>
          <div class="list-item-content">
            <router-link class="profile-link" :to="'/users/' + user.id">
              <h4>{{ user.userName }}</h4>
            </router-link>
          </div>
          <div class="friend-status" v-if="friends.indexOf(user.id) !== -1">
            Friend
          </div>
          <div class="me-status" v-if="user.id == currentId">Me</div>
          <div class="spectate-game" v-if="user.id != currentId && user.isActive && user.inGame" >
            <button class="spectate-btn" @click="spectateMatch(user.id)">
              <i class='bx bx-glasses-alt'></i>
            </button>
          </div>
          <div class="user-status">
            <div v-if="user.inGame" id="ingame-circle"></div>
            <div v-else-if="user.isActive" id="online-circle"></div>
            <div v-else id="offline-circle"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import Avatar from "@/components/users/Avatar.vue";
import io from "socket.io-client";
import router from '@/router';
import SocketServices from "../services/SocketServices"
const socket = io("http://localhost:3000", {
	auth: {
		token: localStorage.getItem('user-token'),
		userId: localStorage.getItem('user-id'),
		page: "users"
	}
});

export default defineComponent({
  name: "users-list",
  components: {
    Avatar,
  },
  data() {
    return {
      users: [] as User[],
      friends: [] as number[],
      filteredUsers: [] as User[],
      keyword: "",
      currentId: {} as number,
    };
  },
  watch : {
		'$route': {
			handler: function() {
				socket.offAny();
			},
			deep: true,
			immediate: true,
		},
	},
  methods: {
    retrieveusers() {
      UserDataService.getNonBlocked(Number(localStorage.getItem("user-id")))
        .then((response: ResponseData) => {
          this.users = response.data;
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === Number(localStorage.getItem("user-id")))
              this.friends = this.users[i].friends;
          }
          this.users.sort((a, b) => (a.userName > b.userName ? 1 : -1));
          this.filteredUsers = this.users;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async spectateMatch(id: number) {
      console.log(`try spectate ${id}`)
      socket.emit("findSpectateMatch", id);
    },
    searchhandler() {
      this.filteredUsers = this.users.filter((user) =>
        user.userName.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
  },
  mounted() {
    SocketServices.connectGlobalSocketNotif(socket);
    socket.on("navigateSpectateMatch", (uuid: string) => {
			console.log("spectate match found | uuid : ", uuid);
			router.push("/game/" + uuid);
    });
    this.currentId = Number(localStorage.getItem("user-id"));
    this.retrieveusers();
  },
});
</script>

<style scopped>
.list-img img {
  width: 64px;
  height: 64px;
}
h3 {
  font-size: 30px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.list-wrapper {
  max-width: 400px;
  margin: auto;
}
.profile-link {
  color: black;
  text-decoration: none;
  font-size: 18px;
  align-content: center;
}
.list {
  background-color: white;
  border-radius: 2px;
  list-style: none;
}
.list-item {
  display: flex;
  align-content: center;
  margin: 10px;
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
}
.list-item-content {
  margin-left: 20px;
  margin-right: auto;
}
.list-wrapper input[type="text"] {
  padding: 6px;
  font-size: 17px;
}
.user-status {
  margin-left: 5%;
  margin-right: 10%;
}
.user-status .online {
  color: green;
}
.user-status .offline {
  background-color: red;
}
.friend-status {
  background-color: #4bbd4b;
  font-weight: bold;
  color: white;
  padding: 5px;
}
.me-status {
  background-color: black;
  font-weight: bold;
  color: white;
  padding: 5px;
}
.spectate-game {
    width: 50px;
}
.spectate-btn {
    background-color: white;
    color: black;
    margin: 0;
    padding: 0;
}
.spectate-btn i {
    border: solid black 2px;
    border-radius: 100%;
    padding: 5px;
    margin-right: 5px;
    font-size: 25px;
    /* width: 25px; */
    /* height: 25px; */
}
</style>
