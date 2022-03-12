<template>
  <h4>Turn On Two Factor Authentication</h4>
  <QRcode />
  <div class="send-code">
    <div class="form-group">
      <input
        type="text"
        maxlength="6"
        minlength="6"
        required
        v-model="authcode"
        size="6"
        v-on:keyup.enter="sendCode"
      />
    </div>
    <button @click="sendCode" class="btn btn-submit">
      Turn on Two Factor Authentification
    </button>
  </div>
  <p>{{ error }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import QRcode from "./QRcode.vue";

export default defineComponent({
  components: {
    QRcode,
  },
  data() {
    return {
      error: "",
      user: {} as User,
      authcode: "",
    };
  },
  methods: {
    getUser(id: number) {
      UserDataService.get(id)
        .then((response: ResponseData) => {
          this.error = "";
          this.user = response.data;
        })
        .catch((e: Error) => {
          this.error = e.message;
          console.log(e);
        });
    },
    sendCode() {
      let data = {
        twoFAuthCode: this.authcode,
        id: this.user.id,
      };
      UserDataService.turn2FAon(data)
        .then(() => {
          this.error = "";
          this.$router.push("/update-profile");
        })
        .catch((e) => {
          this.error = e.response.data.message;
        });
    },
  },
  mounted() {
    if (localStorage.getItem("user-id")) {
      this.getUser(Number(localStorage.getItem("user-id")));
    }
  },
});
</script>

<style scoped>
input {
  font-size: 20px;
}
</style>
