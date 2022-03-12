<template>
  <img
    v-if="user.avatar"
    :src="`http://localhost:3000/users/${user.id}/avatar`"
  />
  <img
    v-else
    :src="`https://avatars.dicebear.com/api/avataaars/${user.id}.svg`"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import User from "@/types/User";

export default defineComponent({
  name: "User",
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
  },
});
</script>

<style scoped>
img {
  object-fit: contain;
}
</style>
