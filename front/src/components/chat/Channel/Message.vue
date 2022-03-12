<template>
  <div
    class="container"
    :class="this.sender ? 'message-sender' : 'message-not-sender'"
    v-if="!this.isblocked"
  >
    <div v-if="!this.sender" class="sender-avatar">
      <Avatar :user="this.owner" />
    </div>
    <div class="message-block">
      <div v-if="!this.sender" class="sender-info">
        {{ this.owner.userName }}
      </div>
      <div :class="this.sender ? 'sender' : 'not-sender'">
        <p :class="this.sender ? 'text-sender' : 'text-not-sender'">
          {{ this.message.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatMessage from "@/types/ChatMessage";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import UserDataService from "@/services/UserDataService";
import Avatar from "@/components/users/Avatar.vue";

export default defineComponent({
  name: "chat-message",
  components: {
    Avatar,
  },
  data() {
    return {
      owner: {} as User,
      sender: {} as boolean,
      isblocked: false as boolean,
    };
  },
  props: {
    user: {
            type: Object as () => User,
            required: true,
    },
    message: {
      type: Object as () => ChatMessage,
      required: true,
    },
  },
  methods: {
    async getOwnerByID(id: number) {
      await UserDataService.get(id)
        .then((response: ResponseData) => {
          this.owner = response.data;
        })
        .catch((e: Error) => {
          console.log(e);
        });
    },
    async initElements() {
      await this.getOwnerByID(this.message.owner);
      this.sender = this.user.id === this.message.owner ? true : false;
      if (!this.sender && this.user.blockedUsers.indexOf(this.owner.id) != -1)
        this.isblocked = true;
    },
  },
  mounted() {
    this.initElements();
  },
});
</script>

<style scoped>
.container {
  display: flex;
	flex: 1 1 75%;
  word-break: break-word;
  max-width: 75%;
}
.message-sender {
  justify-content: flex-end;
  margin: 3px;
  float: right;
}
.message-not-sender {
  align-items: flex-start;
  float: left;
}
.message-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.sender {
  background-color: #218aff;
  border-radius: 20px;
  padding: 3px;
}
.not-sender {
  background-color: grey;
  border-radius: 20px;
  padding: 3px;
}
.message-block p {
  color: white;
  margin: 5px;
}
.text-sender {
  text-align: right;
}
.text-not-sender {
  text-align: left;
}
.sender-avatar {
  align-self: flex-end;
  margin-right: 3px;
}
.sender-avatar img {
  border: 2px solid #ddd;
  border-radius: 100%;
  width: 42px;
  height: 42px;
}
</style>
