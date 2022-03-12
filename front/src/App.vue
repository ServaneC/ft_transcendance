<template>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
  <NavBar />
  <router-view :key="$route.fullPath" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
button {
  border: none;
  padding: 8px;
  color: white;
  background-color: rgb(24, 24, 24);
  text-align: center;
  font-size: 18px;
  opacity: 0.9;
  text-decoration: none;
  margin: 5px;
  cursor: pointer;
}
button:hover {
  opacity: 1;
}
ul {
  list-style-type: none;
}
#online-circle {
  background: #1fcc00;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 2px;
}
#ingame-circle {
  background: #0096ff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 2px;
}
#offline-circle {
  background: #ff0000;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 3px;
}
#loader {
  width: 20px;
}
#loader-wheel {
  animation: spin 1s infinite linear;
  border: 2px solid rgba(30, 30, 30, 0.5);
  border-left: 4px solid #fff;
  border-radius: 50%;
  height: 20px;
  width: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
