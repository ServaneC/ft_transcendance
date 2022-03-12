<template>
  <div class="login">
    <a :href="url">
      <button>Sign in with 42</button>
    </a>
    <router-link to="/illegal-login">
      <button>Illegal login</button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { login } from "@/statics/log.methods";

export default defineComponent({
  name: "Login",
  data() {
    return {
      url: "",
    };
  },
  mounted() {
    this.url = login.loginUser();
  },
});
</script>

<style scoped>
.login {
  margin: 20%;
}
</style>
