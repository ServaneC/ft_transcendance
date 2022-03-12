<template>
  <div class="list">
    <div class="list-wrapper">
      <h2>Users</h2>
      <div class="explanation">
        <p v-if="currentUser.isWebsiteOwner"><i class='bx bx-bulb'></i>You can set and Unset Website Admin </p>
        <p><i class='bx bx-bulb'></i> You can Ban and Unban users from Website (except Owner)</p>
      </div>
      <input
        type="text"
        placeholder="Search an user..."
        v-model="keyword"
        @input="searchhandler"
      />
      <ul>
        <li :class="`list-item ${banClass(user)}`" v-for="user in filteredUsers" :key="user.id">
            <Avatar :user="user" />
          <div class="list-item-content">
            <router-link class="profile-link" :to="'/users/' + user.id">
              <h4>{{ user.userName }}</h4>
            </router-link>
            <div class="status-me" v-if="user.id == currentUser.id">Me</div>
          </div>
          <div class="status-div">
              <div class="status-owner" v-if="user.isWebsiteOwner">Owner</div>
              <div class="status-admin" v-else-if="!currentUser.isWebsiteOwner && user.isWebsiteAdmin && !user.isWebsiteOwner">Admin</div>
              <button
                class="add-admin-btn"
                @click="updateUserAdmin(user.id, true)"
                v-if="currentUser.isWebsiteOwner && user.id != currentUser.id && !user.isWebsiteAdmin && !user.isPermaBan"
              >
              + Admin
              </button>
              <button
                class="remove-admin-btn"
                @click="updateUserAdmin(user.id, false)"
                v-if="currentUser.isWebsiteOwner && user.id != currentUser.id && user.isWebsiteAdmin"
              >
              - Admin
              </button>
              <button 
                class="ban-btn"
                @click="banUser(user.id)"
                v-if="user.id != currentUser.id && !user.isWebsiteOwner && user.isPermaBan == false"
              >
              Ban
              </button>
              <button
                class="unban-btn"
                @click="unbanUser(user.id)"
                v-if="user.id != currentUser.id && !user.isWebsiteOwner && user.isPermaBan"
              >
              Unban
              </button>
          </div>
          <div class="user-status">
            <div v-if="user.isActive" id="online-circle"></div>
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

export default defineComponent({
  name: "admin-users-list",
  components: {
    Avatar,
  },
  data() {
    return {
      users: [] as User[],
      filteredUsers: [] as User[],
      keyword: "",
      currentUser: {} as User,
    };
  },
  methods: {
    async retrieveUsers() {
      return await UserDataService.getAll()
      .then((response: ResponseData) => {
        this.users = response.data;
        this.filteredUsers = this.users.sort((a, b) => (a.userName > b.userName ? 1 : -1));
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
    async banUser(userId: number) {
      UserDataService.banFromSite(userId)
      .then(async (response: ResponseData) => {
        console.log("User successfully banned");
        await this.retrieveUsers();
      })
      .catch((e: Error) => {
        console.log(e.message);
      })
    },
    async unbanUser(userId: number) {
      UserDataService.unbanFromSite(userId)
      .then(async (response: ResponseData) => {
        console.log("User successfully unbanned");
        await this.retrieveUsers();
      })
      .catch((e: Error) => {
        console.log(e.message);
      })
    }, 
    async updateUserAdmin(userId: number, toAdd: boolean) {
      const data = {
        user: userId as number,
        toAdd: toAdd as boolean,
      };
      await UserDataService.updateWebsiteAdmin(data)
      .catch((e: Error) => {
        console.log(e.message);
      })
      await this.retrieveUsers();
    },
    banClass(user: User): string {
      if (user.isPermaBan)
        return "ban";
      return "";
    }
  },
  async mounted() {
    UserDataService.get(Number(localStorage.getItem("user-id")))
    .then((response: ResponseData) => {
      this.currentUser = response.data;
    })
    .catch((e: Error) => {
      console.log(e);
    });
    await this.retrieveUsers();
  },
});
</script>

<style scopped>
h2 {
  margin: 0;
}
.explanation {
  border: solid lightgray 5px;
  background-color: lightgray;
  padding: 10px;
  margin: 10px;
}
.explanation p {
  margin: 0;
} 
.list-item img {
  width: 64px;
  height: 64px;
}
.list-item-content {
  width: 90px;
  text-align: initial;
}
.list-item-content h4 {
  margin: 0;
}
.status-div [class|="status"] {
    font-size: 15px;
    padding: 5px;
    width: 70px;
    margin-block: 2px;
    font-weight: bold;
}
.status-me {
    border: black solid 2px;
    width: 30px;
    text-align: center;
    font-weight: bold;
}
.status-owner {
    background-color: black;
    color: white;
}
.status-admin {
    background-color: gray;
    color: white;
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
.ban {
  background-color: #eb7171;
  border-radius: 10px;
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
.status-div {
  width: 80px;
}
.status-div button {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
  padding: 5px;
  width: 100%;
  border-radius: 10px;
  margin-block: 2px;
}
.status-div .add-admin-btn {
  background-color: beige;
  color: gray;
}
.status-div .remove-admin-btn {
  background-color: gray;
  color: beige;
}
.ban-btn {
  background-color: #f44336;
}
.unban-btn {
  background-color: mediumseagreen;
}
</style>
