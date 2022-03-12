<template>
  <p>Scan it in an Authentificator App and enter the code</p>
  <div v-if="qrcode">
    <img :src="qrcode" />
  </div>
  <div v-else>
    <h1>Please <router-link to="/login">Login</router-link></h1>
  </div>
  <p>{{ error }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserDataService from "@/services/UserDataService";

export default defineComponent({
  data() {
    return {
      error: "",
      qrcode: "",
      authcode: "",
    };
  },
  methods: {
    getQrcode() {
      let data = {
        id: localStorage.getItem("user-id"),
      };
      UserDataService.generateQRcode(data).then((response) => {
        this.qrcode = `data:${response.headers["content-type"]};base64,${btoa(
          String.fromCharCode(...new Uint8Array(response.data))
        )}`;
      });
    },
  },
  mounted() {
    if (localStorage.getItem("user-id")) {
      this.getQrcode();
    }
  },
});
</script>
