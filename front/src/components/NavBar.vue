<template>
  <nav class="main-navbar">
    <div class="logo-wrapper">
      <router-link class="active" to="/">
        <img
          class="logo"
          src="@/assets/pong_logo.png"
          height="60"
          width="140"
        />
      </router-link>
    </div>
    <div class="nav-wrapper">
      <ul>
        <li><router-link to="/Play">Play</router-link></li>
        <li><router-link to="/chat" :user="user">Chat</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li v-if="user && user.isWebsiteAdmin"><router-link to="/admin">Admin</router-link></li>
        <li class="user-login">
          <router-link
            v-if="user && user.userName"
            to="/profile"
            class="user-login"
          >
            {{ user.userName }} 
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import { logout } from "@/statics/log.methods";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      user: {} as User,
    };
  },
  methods: {
    getUser(id: number) {
      UserDataService.get(id)
        .then((response: ResponseData) => {
          this.user = response.data;
          if (!this.user || this.user.isPermaBan) logout();
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    logout,
  },
  watch: {
    $route() {
      if (localStorage.getItem("user-token")) {
        this.getUser(Number(localStorage.getItem("user-id")));
      }
    },
  },
});
</script>

<style scoped>
.main-navbar {
  width: 100%;
}
.main-navbar div {
  display: flex;
  height: 60px;
}
.logo-wrapper {
  float: left;
}
.nav-wrapper ul {
  list-style-type: none;
  display: flex;
  align-items: center;
}
.nav-wrapper li {
  float: left;
  font-weight: bold;
}

.nav-wrapper li:last-child {
  float: right;
}

.nav-wrapper li a {
  color: black;
  padding: 14px 16px;
  text-decoration: none;
  text-align: center;
}
.nav-wrapper .user-login {
  font-weight: normal;
  color: black;
  text-decoration: none;
  text-align: center;
  background-color: white;
  border-radius: 0px;
}

.nav-wrapper .user-login:hover {
  background-color: rgb(206, 206, 206);
  border-radius: 0px;
}

.nav-wrapper .user-login.router-link-exact-active {
  background-color: white;
  border-radius: 0px;
  border: solid 1px black;
  color: black;
}

.nav-wrapper li a:hover {
  background-color: rgb(206, 206, 206);
  border-radius: 10px;
}

.nav-wrapper li a.router-link-exact-active {
  background-color: black;
  border-radius: 10px;
  color: white;
}
</style>
