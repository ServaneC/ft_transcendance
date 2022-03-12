<template>
  <div v-if="user.userName" class="edit-form">
    <UserInfo v-if="!isblocked" :isFriend="isfriend" :user="user" />
    <h4 v-else>{{ user.userName }}</h4>
    <div v-if="itsMe">
      <router-link to="/profile">
        <button>Got to your profile page</button>
      </router-link>
    </div>
    <div v-else>
      <div>
        <button
          v-if="isfriend && !isblocked"
          class="block-btn"
          @click="removeFromFriends"
        >
          <i class='bx bxs-user-minus' ></i> Remove from Friends
        </button>
        <button
          v-if="!isfriend && !isblocked"
          class="friend-btn"
          @click="addToFriends"
        >
          <i class='bx bxs-user-plus'></i> Add to Friends
        </button>
        <button v-if="isblocked" class="block-btn" @click="removeFromBlocked">
          Unblock
        </button>
        <button v-else class="block-btn" @click="addToBlocked">
          <i class='bx bx-block'></i> Block
        </button>
      </div>
      <router-link v-if="!isblocked" to="/chat">
        <button class="chat-btn">
          <i class='bx bx-chat'></i> Start a private chat
        </button>
      </router-link>
    </div>
    <router-link to="/users">
      <button class="users-link">
        <i class='bx bxs-user-account' ></i> See Other Users
      </button>
    </router-link>
    <p>{{ message }}</p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import UserInfo from "./UserInfo.vue";

export default defineComponent({
  name: "User",
  components: {
    UserInfo,
  },
  data() {
    return {
      userConnected: {} as User,
      user: {} as User,
      itsMe: false,
      isfriend: false,
      isblocked: false,
      message: "",
    };
  },
  methods: {
    async getUser() {
      await UserDataService.get(Number(this.$route.params.id))
        .then((response: ResponseData) => {
          this.user = response.data;
          if (this.user.id === Number(localStorage.getItem("user-id")))
            this.itsMe = true;
          else this.getConnectedUser();
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async getConnectedUser() {
      await UserDataService.get(Number(localStorage.getItem("user-id")))
        .then((response: ResponseData) => {
          this.userConnected = response.data;
          if (this.userConnected.friends.indexOf(this.user.id) !== -1)
            this.isfriend = true;
          if (this.userConnected.blockedUsers.indexOf(this.user.id) !== -1)
            this.isblocked = true;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async addToFriends() {
      let data = {
        user: this.user.id,
        toAdd: true,
      };
      await UserDataService.updateFriends(
        Number(localStorage.getItem("user-id")),
        data
      )
        .then((response: ResponseData) => {
          this.message = response.data.message;
          this.isfriend = true;
        })
        .catch((e: Error) => {
          // this.message = e;
          console.log(e);
        });
    },
    async addToBlocked() {
      let data = {
        user: this.user.id,
        toAdd: true,
      };
      await UserDataService.updateBlocked(
        Number(localStorage.getItem("user-id")),
        data
      )
        .then((response: ResponseData) => {
          this.message = response.data.message;
          this.isblocked = true;
          this.isfriend = false;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async removeFromFriends() {
      let data = {
        user: this.user.id,
        toAdd: false,
      };
      await UserDataService.updateFriends(
        Number(localStorage.getItem("user-id")),
        data
      )
        .then((response: ResponseData) => {
          this.message = response.data.message;
          this.isfriend = false;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async removeFromBlocked() {
      let data = {
        user: this.user.id,
        toAdd: false,
      };
      await UserDataService.updateBlocked(
        Number(localStorage.getItem("user-id")),
        data
      )
        .then((response: ResponseData) => {
          this.message = response.data.message;
          this.isblocked = false;
        })
        .catch((e: Error) => {
          // this.message = e;
          console.log(e);
        });
    },
  },
  mounted() {
    this.getUser();
  },
});
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info {
  margin: 5%;
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
.block-btn {
  background-color: #f44336;
}
.friend-btn {
  background-color: #4bbd4b;
}
.friend-status {
  margin-right: 5px;
}
.users-link {
  background-color: grey;
}
</style>
