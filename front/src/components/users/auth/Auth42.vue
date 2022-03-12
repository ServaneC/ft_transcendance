<template>
  <div>
    <p v-if="state === 'verifying'">Verifying your login...</p>

    <p v-if="state === 'loggedIn'">Logging in...</p>

    <div v-if="state === 'error'">
      <p>Failed to log in :(</p>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ResponseData from "@/types/ResponseData";
import UserDataService from "@/services/UserDataService";

export default defineComponent({
  data() {
    return {
      error: "",
      state: "verifying",
    };
  },
  async mounted() {
    if (!this.$route.query.code) {
      this.$router.push("/login");
      return;
    }

    try {
      UserDataService.get42Token(String(this.$route.query.code))
        .then((response: ResponseData) => {
          if (response.data.message) {
            this.state = "error";
            this.$router.push("/ban");
            this.error = response.data.message;
            return;
          }
          else if (response.data.access_token) {
            localStorage.setItem("user-name", response.data.userName);
            localStorage.setItem("user-id", response.data.id);
            localStorage.setItem("user-token", response.data.access_token);
            if (response.data.isCreated)
              this.$router.push("/update-profile");
            else
              this.$router.push("/profile");
          } else {
            localStorage.setItem("user-id", response.data.id);
            this.$router.push("/2FLogin");
          }
        })
        .catch((e: Error) => {
          localStorage.removeItem("user-token");
          this.state = "error";
          this.error = e.message;
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
