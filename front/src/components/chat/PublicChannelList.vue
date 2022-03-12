<template>
	<div class="channel-list-page">
        <button @click="goto()">Explore Public Channels</button>
        <div class ="form-section">
            <button class="reveal-btn" @click="revealElement('join-private'); hideElement('create-channel');">Join Private Channel</button>
            <button class="reveal-btn" @click="revealElement('create-channel'); hideElement('join-private');">Create Channel</button>
            <div id="join-private">
                <JoinPrivateChannel :userId="user.id"/>
            </div>
            <div id="create-channel">
                <CreateChannel :user="user"/>
            </div>
        </div>
        <ChannelList @refreshChannel="refreshChannelList" :user="user"/>
		<h2>Public Channels you could join</h2>
		<div class="channel-search-div">
			<input type="text"
				placeholder="Search a channel..."
				v-model="search"
				@input="searchhandler"
			>
		</div>
		<div id="to-join-channels" ref="joinChannelRef" class="public-channel-list-div">
			<ul class="public-channel-list" v-if="this.ChannelList.length">
				<li class="public-channel-list-item" v-for="(channel, index) in filteredChannelList" :key="channel.channelName">
					<div class="public-channel-name">
						<h4>{{ channel.channelName }}</h4>
						<img :src="`https://avatars.dicebear.com/api/jdenticon/${channel.channelName}.svg`">
					</div>
					<div class="public-channel-owner">
                        <div class="mini-user-info" v-if="getOwnerByID(channel.owner)">
                            <p>Owner</p>
                            <Avatar :user="getOwnerByID(channel.owner)" />
                            <router-link class="profile-link" :to="'/users/' + channel.owner">
                                <h4>{{ getOwnerByID(channel.owner).userName }}</h4>
                            </router-link>
                        </div>
                        <div v-else>
                            <h4>No Owner</h4>
                            <p>The original owner left the channel</p>
                        </div>
					</div>
                    <div class="property-tag">
                        <p class="public-tag" v-if="channel.isPublic">Public</p>
                    </div>
					<div class="pass-btn-div">
                        <form class="password-input" v-if="channel.isProtected">
                            <input 
                                v-model="password[index]" 
                                :id="`public-password-${index}`" 
                                placeholder="password" 
                                type="password" 
                                autocomplete="off"
                            >
                            <p class="error-message">{{ errorMSG[index] }}</p>
                        </form>
						<div class="btn-div">
                            
							<button
                                class="joined-btn"
							    type="button" 
                                name="button"
							    @click="joinChannel(channel, this.password[index], index)"
                            >
							    Join
                            </button>
						</div>
					</div>
                    <div id="loader">
                        <div v-if="isLoading[index] === true" id="loader-wheel"></div>
                    </div>
			    </li>
		    </ul>
            <h4 v-else>There is no Public Channel to join</h4>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueRouter from 'vue-router'

import User from "@/types/User";
import Channel from "@/types/Channel";

// import UserDataService from '@/services/UserDataService';
import ChannelDataService from '@/services/ChannelDataService';
import ResponseData from "@/types/ResponseData";
import Avatar from "@/components/users/Avatar.vue";
import JoinPrivateChannel from "@/components/chat/JoinPrivateChannel.vue";
import CreateChannel from "@/components/chat/CreateChannel.vue";
import ChannelList from "@/components/chat/myChannelsList.vue";

export default defineComponent({
    name: "channel-list",
    data() {
        return {
            OwnersList: [] as User[],
            ChannelList: [] as Channel[],
			filteredChannelList: [] as Channel[],
			search: "",
			errorMSG: [] as string[],
			password: [] as string[],
			isLoading: [] as boolean[],
        };
    },
    components: {
        Avatar,
        JoinPrivateChannel,
        CreateChannel,
        ChannelList,
    },
    props: {
      user: {
          type: Object as () => User,
          required: true,
      },
    },
    methods: {
        async refreshChannelList() {
            await ChannelDataService.getAllPublicChannels()
            .then((response : ResponseData) => {
                this.ChannelList = response.data.channels;
                this.OwnersList = response.data.owners;
				this.filteredChannelList = this.ChannelList.filter((channel) => channel.banList.indexOf(this.user.id) == -1 && channel.users.indexOf(this.user.id) == -1);
                this.ChannelList = this.filteredChannelList;
            })
            .catch((e: Error) => {
                console.log("Error: " + e);
            });
        },
        async deleteChannel(channel: Channel, index: number) {
            this.isLoading[index] = true;
            ChannelDataService.deleteChannel(channel.channelName)
            .then((response : ResponseData) => {
                this.refreshChannelList();
                this.isLoading[index] = false;
            })
            .catch((e: Error) => {
                this.isLoading[index] = false;
            });
        },
		async searchhandler() {
			this.filteredChannelList = await this.ChannelList.filter((channel) =>
			  channel.channelName.toLowerCase().includes(this.search.toLowerCase()));
		},
        async addUserChannel(channel : Channel) {
            const data = {
                user: this.user.id as number,
                toAdd: true,
            };
            await ChannelDataService.updateChannelUser(channel.channelName, data)
            .then((response: ResponseData) => {
                // socket.emit('updateChannel', channel.channelName);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async joinChannel(channel : Channel, current_password: string, index: number) {
            this.errorMSG[index] = "";
			this.isLoading[index] = true;
			let data = {
                password: current_password,
			};
			await ChannelDataService.canJoinChannel(channel.channelName, data)
			.then(async (response : ResponseData) => {
                if (channel.users.indexOf(this.user.id) == -1) {
                    await this.addUserChannel(channel);
                }
				this.$router.push("/Channel/" + channel.channelName);
			})
            .catch((e) => {
				this.errorMSG[index] = "Error: " + e.response.data.message;
				this.isLoading[index] = false;
            });
        },
        getOwnerByID(ownerId: number): User {
           return (this.OwnersList[this.OwnersList.map(x => x.id).indexOf(ownerId)]);
        },
        revealElement(id: string) {
            var x = document.getElementById(id);
            if (x && x.style.display === "none") {
                x.style.display = "block";
            } else if (x) {
                x.style.display = "none";
            }
        },
        hideElement(id:string) {
            var x = document.getElementById(id);
            if (x && x.style.display === "block") {
                x.style.display = "none";
            } 
        },
        goto() {
            var element = this.$refs.joinChannelRef as any;
            window.scrollTo(0, element.offsetTop);
        },
    },
    mounted() {
        this.refreshChannelList();
        this.revealElement('create-channel');
        this.revealElement('join-private');
    },
});
</script>

<style scoped>
.mini-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10%;
}
.mini-user-info.profile-link {
  color: black;
  text-decoration: none;
}

.mini-user-info img {
    border: 2px solid #ddd;
    border-radius: 100%;
    width: 50px;
    height: 50px;
}
.public-tag {
  background-color: #4bbd4b;
  font-weight: bold;
  color: white;
  padding: 5px;
  border-radius: 10px;
}
.public-channel-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.public-channel-list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-evenly;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin: 5px;
    padding: 10px;
    width: 70%;
}
.public-channel-name img {
    width: 100px;
}
.public-channel-name h4 {
    font-size: 20px;
}
.public-channel-name h4,
.public-channel-owner p,
.public-channel-owner h4 {
    margin: 0;
}
.public-channel-owner {
    width: 100px;
}
.channel-list-page input[type="text"],
.channel-list-page input[type="password"] {
  padding: 6px;
}
.public-password-input p {
    margin: 0;
    color: red;
}
.profile-link {
  color: black;
  text-decoration: none;
  font-size: 18px;
  align-content: center;
}
.delete-btn {
  background-color: #f44336;
}
#join-private {
  display: none;
  width: 70%;
  padding: 20px 0;
  text-align: center;
  background-color: lightgray;
  margin-inline: auto;
  margin-block: 20px;
}
#create-channel {
  display: none;
  width: 70%;
  padding: 20px 0;
  text-align: center;
  background-color: lightgray;
  margin-inline: auto;
  margin-block: 20px;
}
.reveal-btn, .joined-btn {
    color:black;
    background-color: lightgray;
    margin-bottom: 20px;
}
.pass-btn-div {
    width: 240px;
}
.error-message {
    margin: 0;
    color: #f44336;
}
</style>
