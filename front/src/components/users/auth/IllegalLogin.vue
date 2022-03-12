<template>
  <div>
    <p v-if="state === 'verifying'">Verifying your login...</p>

    <p v-if="state === 'loggedIn'">Logging in...</p>

    <div v-if="state === 'error'">
      <p>Failed to login in :(</p>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import http from "@/http-common";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";

export default defineComponent({
  data() {
    return {
      error: "",
      user: {} as User,
      state: "verifying",
    };
  },
  async mounted() {
    try {
      http
        .get("http://localhost:3000/auth/0")
        .then((response: ResponseData) => {
          localStorage.setItem("user-name", response.data.userName);
          localStorage.setItem("user-id", response.data.id);
          localStorage.setItem("user-token", response.data.access_token);
          this.$router.push("/");
        })
        .catch((e: Error) => {
          localStorage.removeItem("user-token");
          console.log(e);
        });
      this.state = "loggedIn";
    } catch (e) {
      this.error = e.response.data.message;
      this.state = "error";
    }
  },
});
</script>
