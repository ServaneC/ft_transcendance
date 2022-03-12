<template>
  <div class="list row">
    <div class="list-wrapper">
      <h2>Channels</h2>
      <div class="explanation">
        <p><i class='bx bx-bulb'></i>You can:</p>
        <p>- Watch all channels even the one you didn't joined</p>
        <p>- Set and Unset admin and owner of channels </p>
        <p>- Destroy permanently channels</p>
        <br />
        <p> <i class="fas fa-eye"></i> Public    <i class="far fa-eye-slash"></i> Private</p>
        <p> <i class="fas fa-lock"></i> Password protected    <i class="fas fa-lock-open"></i> Not Protected </p>
      </div>
      <input
        type="text"
        placeholder="Search an channel..."
        v-model="keyword"
        @input="searchhandler"
      />
      <ul class="channel-list">
        <li class="channel-list-item" v-for="channel in filteredChannels" :key="channel.channelName">
              <div class="public-channel-name">
                <h4>{{ channel.channelName }}</h4>
                <img :src="`https://avatars.dicebear.com/api/jdenticon/${channel.channelName}.svg`">
              </div>
              <div class="admin-btn-div">
                <router-link class="channel-link" :to="'/Channel/' + channel.channelName"><button class="openbtn" type="button"> Open </button></router-link>
                <button class="delete-btn" type="button" @click="deleteChannel(channel)"> Destroy </button>
              </div>
              <div class="channel-icon">
                <div class="public-status" v-if="channel.isPublic"> <i class="fas fa-eye"></i> </div>
                <div class="private-status" v-else> <i class="far fa-eye-slash"></i> </div>
                <div class="protected-status" v-if="channel.isProtected"> <i class="fas fa-lock"></i> </div>
                <div class="public-status" v-else> <i class="fas fa-lock-open"></i> </div>
              </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChannelDataService from "@/services/ChannelDataService";
import Channel from "@/types/Channel";
import ResponseData from "@/types/ResponseData";

export default defineComponent({
  name: "admin-channels-list",
  data() {
    return {
      channels: [] as Channel[],
      filteredChannels: [] as Channel[],
      keyword: "",
    };
  },
  methods: {
    async retrieveChannels() {
      ChannelDataService.getAllChannels().then((response: ResponseData) => {
        this.channels = response.data;
        this.channels.sort((a, b) => (a.channelName > b.channelName ? 1 : -1));
        this.filteredChannels = this.channels;
      })
      .catch((e: Error) => {
        console.log(e);
      });
    },
    async deleteChannel(channel: Channel) {
      ChannelDataService.deleteChannel(channel.channelName)
      .then((response : ResponseData) => {
          this.retrieveChannels();
      })
      .catch((e: Error) => {
          console.log("Error: " + e);
      });
    },
    searchhandler() {
      this.filteredChannels = this.channels.filter((channel) =>
        channel.channelName.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
  },
  async mounted() {
    await this.retrieveChannels();
  },
});
</script>

<style scopped>
h2 {
  margin: 0;
}
.explanation {
  border: solid lightgray 5px;
  background-color: lightgray;
  padding: 10px;
  margin: 10px;
}
.explanation p {
  margin: 0;
} 
.public-channel-name img {
  width: 100px;
}
.admin-btn-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-btn {
  background-color: #f44336;
}
.public-channel-name h4 {
  margin: 0;
}
.admin-btn-div button {
  width: 100%;
}
.channel-list {
  list-style: none;
  padding: 0;
}
.channel-list-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin: 5px;
    padding: 10px;
    width: 100%;
    align-items: center;
}
</style>
