<template id="">
	<div class="channel-list-page">
		<h2>Channels you joined</h2>
		<div class="channel-list-container">
			<input type="text"
				placeholder="Search a channel..."
				v-model="search"
				@input="searchhandler"
			>
		</div>
		<div class="channel-list-div">
			<ul class="channel-list" v-if="this.ChannelList.length">
				<li class="channel-list-item" v-for="(channel, index) in filteredChannelList" :key="channel.channelName">
					<div class="channel-name">
						<h4>{{ channel.channelName }}</h4>
						<img :src="`https://avatars.dicebear.com/api/jdenticon/${channel.channelName}.svg`">
					</div>
					<div class="channel-owner">
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
						<p v-else class="private-tag">Private</p>
                    </div>
					<div class="pass-btn-div">
						<!-- PASSWORD -->
                        <form class="password-input" v-if="channel.isProtected">
                            <input v-model="password[index]" :id="`password-${index}`" v-if="showPassword == false" type="password" placeholder="password" autocomplete="off" >
                            <input v-model="password[index]" :id="`password-${index}`" v-else type="text" placeholder="password" autocomplete="off">
                            <label class="eye-checkbox">
                                <input type="checkbox" @change="togglePasswordVisibility"/>
                                <i class="fas fa-eye checked"></i>
                                <i class="fas fa-eye-slash unchecked"></i>
                            </label>
                            <p>{{ errorMSG[index] }}</p>
                        </form>
						<div class="btn-div">
							<button 
                                class="joined-btn"
							    type="button"
                                name="button"
							    @click="joinChannel(channel, this.password[index], index)"
                            >
							    Open
                            </button>
                            <button 
                                class="delete-btn"
							    type="button" 
                                name="button"
							    @click="leaveChannel(channel, index)"
                            >
							    Leave
                            </button>
						</div>
					</div>
                    <div id="loader">
                        <div v-if="isLoading[index] === true" id="loader-wheel"></div>
                    </div>
			    </li>
		    </ul>
            <div v-else>
                <h4>You haven't join any Channel...</h4>
                <h4>You can explore public channels, join a private channel or create one</h4>
            </div>
		</div>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, Ref } from "vue";
import User from "@/types/User";
import Channel from "@/types/Channel";
import ChannelDataService from '@/services/ChannelDataService';
import ResponseData from "@/types/ResponseData";
import Avatar from "@/components/users/Avatar.vue";

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
            showPassword: false as boolean,
        };
    },
    props: {
        user: {
            type: Object as () => User,
            required: true,
        },
    },
    components: {
        Avatar,
    },
    methods: {
        async refreshChannelList() {
            await ChannelDataService.getAllUserChannel(this.user.id)
            .then((response : ResponseData) => {
                this.ChannelList = response.data.channels;
                this.OwnersList = response.data.owners;
                this.filteredChannelList = this.ChannelList.filter((channel) => channel.banList.indexOf(this.user.id) == -1 && channel.kickList.indexOf(this.user.id) == -1);;
                this.ChannelList = this.filteredChannelList;
            })
            .catch((e: Error) => {
                console.log("Error: " + e);
            });
        },
		async searchhandler() {
			this.filteredChannelList = await this.ChannelList.filter((channel) =>
			  channel.channelName.toLowerCase().includes(this.search.toLowerCase()));
		},
        async joinChannel(channel : Channel, current_password: string, index: number) {
            this.errorMSG[index] = "";
			this.isLoading[index] = true;
			let data = {
                password: current_password,
			};
			await ChannelDataService.canJoinChannel(channel.channelName, data)
			.then((response : ResponseData) => {
                localStorage.setItem("channel-pwd", current_password);
                this.$router.push("/Channel/" + channel.channelName);

			})
            .catch((e: any) => {
				this.errorMSG[index] = "Error: " + e.response.data.message;
				this.isLoading[index] = false;
            });
        },
        async leaveChannel(channel : Channel, index: number) {
            this.isLoading[index] = true;
            if (channel.users.indexOf(this.user.id) != -1) {
                const data = {
                    user: this.user.id as number,
                    toAdd: false,
                };
                await ChannelDataService.updateChannelUser(channel.channelName, data)
                .then((response: ResponseData) => {
                    this.isLoading[index] = false;
                    this.$emit("refreshChannel");
                    this.refreshChannelList();
                })
                .catch((e: Error) => {
                    console.log(e);
                });
            }
        },
        getOwnerByID(ownerId: number): User {
           return (this.OwnersList[this.OwnersList.map(x => x.id).indexOf(ownerId)]);
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },
    mounted() {
        this.refreshChannelList();
    },
});
</script>

<style scoped>
img {
    background-color: white;
}
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
.private-tag {
  background-color: black;
  font-weight: bold;
  color: white;
  padding: 5px;
  border-radius: 10px;
}
.channel-info {
    border: 0;
}
.channel-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.channel-list-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-evenly;
    border: 2px solid #ddd;
    background-color: #f0f0f0;
    border-radius: 10px;
    margin: 5px;
    padding: 10px;
    width: 70%;
}
.channel-name h4 {
    margin: 0;
    font-size: 20px;
}
.channel-name img {
    width: 100px;
}
.channel-owner p,
.channel-owner h4,
.mini-user-info h4 {
    margin: 0;
}
.channel-list-page input[type="text"],
.channel-list-page input[type="password"] {
  padding: 6px;
}
.password-input p {
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
.channel-owner {
    width: 100px;
}
.pass-btn-div {
    width: 240px;
}
.eye-checkbox {
    margin-left: 5px;
    color: gray;
}
.eye-checkbox input[type="checkbox"],
.eye-checkbox .checked {
    display: none;
}
.eye-checkbox input[type="checkbox"]:checked ~ .checked
{
    display: inline-block;
}
 
.eye-checkbox input[type="checkbox"]:checked ~ .unchecked
{
    display: none;
}
</style>