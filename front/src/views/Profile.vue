<template>
  <div v-if="user.userName" class="user-profile">
    <UserInfo :user="user" />
    <div class="user-info">
      <router-link to="/update-profile">
        <button>Update Profile</button>
      </router-link>
      <button
        class="deletebtnb0"
        onclick="document.getElementById('id01').style.display='block'"
      >
        Logout
      </button>
    <FriendList />
    </div>
    <p>{{ error }}</p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
  <div id="id01" class="modal">
    <span
      onclick="document.getElementById('id01').style.display='none'"
      class="close"
      title="Close Modal"
      >&times;</span
  >
    <form class="modal-content">
      <div class="modal-window">
        <h1>Log out</h1>
        <p>Are you sure you want to log out ?</p>
        <div class="clearfix">
          <button
            class="cancelbtn"
            onclick="document.getElementById('id01').style.display='none'"
          >
            Cancel
          </button>
          <button type="button" class="deletebtn" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import { logout } from "@/statics/log.methods";
import FriendList from "@/components/users/FriendsList.vue";
import UserInfo from "@/components/users//UserInfo.vue";

export default defineComponent({
  name: "User",
  components: {
    FriendList,
    UserInfo,
  },
  data() {
    return {
      error: "",
      user: {} as User,
    };
  },
  methods: {
    getUser(id: number) {
      UserDataService.get(id)
        .then((response: ResponseData) => {
          this.user = response.data;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    logout,
  },
  mounted() {
    this.getUser(Number(localStorage.getItem("user-id")));
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
  margin: 0%;
}
img {
  width: 300px;
  height: 300px;
  border: 5px solid #ddd;
  border-radius: 10px;
}
h4 {
  font-size: 30px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.cancelbtn,
.deletebtn {
  float: left;
  width: 50%;
  margin: 0%;
}

/* Add a color to the cancel button */
.cancelbtn {
  background-color: #ccc;
  color: black;
}

/* Add a color to the delete button */
.deletebtnb0,
.deletebtn {
  background-color: #f44336;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: #474e5d;
  padding-top: 50px;
}
.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}
.close {
  position: absolute;
  right: 35px;
  top: 15px;
  font-size: 40px;
  font-weight: bold;
  color: #f1f1f1;
}

.close:hover,
.close:focus {
  color: #f44336;
  cursor: pointer;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.friend-list div {
  display: flex;
}
</style>
