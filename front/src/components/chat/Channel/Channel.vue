<template>
    <div class="channel-component" v-if="!isLoading">
        <div class="player-list">
            <div class="channel-btn">
                <button 
                    class="leave-btn"
                    type="button" 
                    name="button"
                    v-if="channel.users.indexOf(user.id) != -1"
                    @click="leaveChannel()"
                >
                    Leave
                </button>
                <router-link to="/Chat"><button 
                    class="back-btn"
                    type="button" 
                    name="button"
                >
                    Back to channels list <i class='bx bx-exit'></i>
                </button></router-link>
                <router-link to="/admin"><button 
                    class="admin-btn"
                    type="button" 
                    name="button"
                    v-if="user.isWebsiteAdmin"
                >
                    Go to Admin Page<i class='bx bx-exit'></i>
                </button></router-link>
                <button v-if="channel.owner == user.id" class="reveal-btn" @click="revealPassword">
                        Update Channel Password
                </button>
            </div>
            <div class="ban-list" v-if="channel.banList.length && channel.admins.indexOf(user.id) !== -1">
                <select id="mon_select"  @change="onChange">
                    <option>Unban an users</option>
                    <option
                        class="blocked-item"
                        v-for="banuser in banList"
                        :key="banuser.id"
                        :value="banuser.id"
                    >
                     {{ banuser.userName }}
                    </option>
                </select>
            </div>
            <div id="update-password">
                <UpdatePassword v-if="channel.owner == user.id" :channel="channel" :user="user" />
            </div>
            <ul>
                <li class="player-list-item" v-for="player in filteredPlayerList" :key="player.id">
                    <div class="user-state">
                        <div v-if="player.inGame" id="ingame-circle"></div>
                        <div v-else-if="player.isActive" id="online-circle"></div>
                        <div v-else id="offline-circle"></div>
                    </div>
                    <Avatar :user="player" />
                    <div class="list-item-content">
                        <router-link class="profile-link" :to="'/users/' + player.id">
                            <h4>{{ player.userName }}</h4>
                        </router-link>
                        <div class="status-me" v-if="player.id == user.id">
                            Me
                        </div>
                        <div class="status-friend" v-if="user.friends.indexOf(player.id) !== -1">
                            Friend
                        </div>
                    </div>
                    <div class="status-div">
                        <button
                            class="add-owner-btn"
                            v-if="user.isWebsiteAdmin && channel.owner == null"
                            @click="updateOwner(player.id, true)"
                        >
                            + Owner
                        </button>
                        <button
                            class="remove-owner-btn"
                            v-else-if="user.isWebsiteAdmin && player.id == channel.owner"
                            @click="updateOwner(player.id, false)"
                        >
                            - owner
                        </button>
                        <div class="status-owner" v-else-if="player.id == channel.owner">
                            Owner
                        </div>
                        <button
                            class="add-admin-btn"
                            v-if="(user.isWebsiteAdmin || ( user.id !== player.id && channel.admins.indexOf(user.id) !== -1)) && (channel.admins.indexOf(player.id) == -1 && player.id != channel.owner)"
                            @click="updateAdmin(player.id, true)"
                        >
                            + Admin
                        </button>
                        <button
                            class="remove-admin-btn"
                            v-else-if="(user.isWebsiteAdmin || ( user.id !== player.id && channel.admins.indexOf(user.id) !== -1)) && (channel.admins.indexOf(player.id) !== -1 && player.id != channel.owner)"
                            @click="updateAdmin(player.id, false)"
                        >
                            - Admin
                        </button>
                        <div class="status-admin" v-else-if="channel.admins.indexOf(player.id) !== -1 && player.id != channel.owner">
                            Admin
                        </div>
                        <button
                            class="mute-btn"
                            v-if="user.id != player.id && channel.admins.indexOf(user.id) !== -1 && player.id != channel.owner && channel.muteList.indexOf(player.id) == -1"
                            @click="updateMute(player.id, true)"
                        >
                            Mute
                        </button>
                        <button
                            class="unmute-btn"
                            v-else-if="channel.admins.indexOf(user.id) !== -1 && player.id != channel.owner && channel.muteList.indexOf(player.id) != -1"
                            @click="updateMute(player.id, false)"
                        >
                            Unmute
                        </button>
                        <div class="ban-kick-div">
                            <button
                                class="ban-btn"
                                v-if="user.id != player.id && channel.admins.indexOf(user.id) !== -1 && player.id != channel.owner && channel.banList.indexOf(player.id) == -1"
                                @click="updateBan(player.id, true)"
                            >
                                Ban
                            </button>
                            <button
                                class="kick-btn"
                                v-if="user.id != player.id && channel.admins.indexOf(user.id) !== -1 && player.id != channel.owner && channel.banList.indexOf(player.id) == -1"
                                @click="kickUser(player.id)"
                            >
                                Kick
                            </button>
                        </div>
                        <div class="status-mute" v-if="channel.muteList.indexOf(player.id) != -1 && channel.admins.indexOf(user.id) == -1">
                            Muted
                        </div>
                    </div>
                    <div class="start-game">
                        <button v-if="player.id != user.id && player.isActive && !player.inGame" class="match-btn" @click="startMatch(player.id)">
                            <i class='bx bx-joystick'></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
        <div class="message-box">
            <div class="box-name">
                <h4>{{ channel.channelName }}</h4>
            </div>
            <div class="messages">
                <ul ref="ScrollBar">
                    <li class="Plist-group-item" v-for="message in Messages" :key="message.id">
                        <!-- v-if="user.blockedUsers.indexOf(message.owner) == -1" -->
                    <MessageComponent  :message="message" :user="user" />
                </li>
            </ul>
        </div>
        <!-- v-if="channel.muteList.indexOf(user.id) == -1" -->
        <div v-if="channel.users.indexOf(user.id) == -1" class="send-message-area">
        </div>
        <div v-else-if="channel.muteList && channel.muteList.indexOf(user.id) == -1" class="send-message-area">
            <textarea
            placeholder="Type your message here ..."
            v-model="currentMessage"
            ></textarea>
            <button
                type="button"
                name="button"
                class="send-btn"
                style="width: 75%"
                @click="SendMessage"
            >
            Send
            </button>
        </div>
        <div v-else class="mute-message-box">
            <h3>You have been muted by an Admin, you can't chat until unmuted</h3>
        </div>
    </div>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import User from "@/types/User";
import ChannelDataService from "@/services/ChannelDataService";
import UserDataService from "@/services/UserDataService";
import ResponseData from "@/types/ResponseData";
import Channel from "@/types/Channel";
import Message from "@/types/ChatMessage";
import MessageComponent from "./Message.vue";
import Avatar from "@/components/users/Avatar.vue";
import io from "socket.io-client";
import SocketServices from "../../../services/SocketServices";
import UpdatePassword from "@/components/chat/Channel/UpdatePassword.vue";

const socket = io("http://localhost:3000", {
	auth: {
		token: localStorage.getItem('user-token'),
		userId: localStorage.getItem('user-id'),
		page: 'channel'
	}
});

export default defineComponent({
    data() {
        return {
            playerList: [] as User[],
            filteredPlayerList: [] as User[],
            banList: [] as User[],
            user: {} as User,
            channel: {} as Channel,
            Messages: [] as Message[],
            currentMessage: "" as string,
            isLoading: true as boolean,
        };
    },
    components: {
        MessageComponent,
        Avatar,
        UpdatePassword,
    },
    watch : {
		'$route': {
			handler: function() {
				socket.offAny();
			},
			deep: true,
			immediate: true,
		},
	},
    methods: {
        onChange(e: any) {
            if(e.target.options.selectedIndex > -1) {
                const value = Number((e.target.options[e.target.options.selectedIndex].value));
                this.updateBan(value, false);
        }
        },
        async startMatch(id: number) {
            socket.emit("matchUser", id);
        },
        async getAllPlayersInChannel() {
            await ChannelDataService.getAllUsersInChannel(this.channel.channelName)
            .then((response: ResponseData) => {
                this.playerList = response.data;
                if (this.playerList)
                    this.filteredPlayerList = this.playerList.filter((player) => this.user.blockedUsers.indexOf(player.id) == -1);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async getBanList() {
            await ChannelDataService.getBanListUsers(this.channel.channelName)
            .then((response: ResponseData) => {
                this.banList = response.data;
            })
            .catch((e: Error) => {
                (e);
            });
        },
        async getUser(id: number) {
            await UserDataService.get(id)
            .then((response: ResponseData) => {
                this.user = response.data;
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async getChannel() {
            await ChannelDataService.getChannel(String(this.$route.params.channelName))
            .then((response: ResponseData) => {
                this.channel = response.data.channel;
            })
            .catch((e: Error) => {
                this.$router.push("/Chat");
            });
        },
        async checkAccess() {
            if (this.user.isWebsiteAdmin)
                return ;
            else if (this.channel.users.indexOf(this.user.id) == -1) {
                this.$router.push("/Chat");
            }
            else if (this.channel.banList && (this.channel.banList.indexOf(this.user.id) != -1 || this.channel.kickList.indexOf(this.user.id) != -1 ))
                await this.leaveChannel();
            else if (this.channel.isProtected) {
                let data = {
                    password: localStorage.getItem("channel-pwd") as string,
                };
                await ChannelDataService.canJoinChannel(this.channel.channelName, data)
                // .then((response: ResponseData) => {
                //     if (!response.data.value)
                //         this.$router.push("/Chat");
                // })
                .catch((e) => {
          		    console.log("Error: " + e.response.data.message);
                    this.$router.push("/Chat");
      		    });
            }
        },
        async getMessages() {
            await ChannelDataService.getMessagesFromChannel(this.channel.channelName)
            .then((response: ResponseData) => {
                this.Messages = response.data;
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async SendMessage() {
            const data = {
                owner: this.user.id as number,
                message: this.currentMessage as string,
            };
            (data);
            if (this.currentMessage != "") {
                await ChannelDataService.sendMessageToChannel(
                    this.channel.channelName,
                    data
                )
                .then((response: ResponseData) => {
                    this.currentMessage = "";
                    socket.emit('sendMessage', this.channel.channelName);
                })
                .catch((e) => {
                    if (e.response.status == 404)
                        this.$router.push("/Chat");
                });
            }
        },
        async leaveChannel() {
            const data = {
                user: this.user.id as number,
                toAdd: false,
            };
            await ChannelDataService.updateChannelUser(this.channel.channelName, data)
            .then((response: ResponseData) => {
                socket.emit('updateChannel', this.channel.channelName);
                this.$router.push("/Chat");
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async updateAdmin(playerId: number, toAdd: boolean) {
            const data = {
                user: playerId as number,
                toAdd: toAdd as boolean,
            };
            return await ChannelDataService.updateAdmin(this.channel.channelName, data)
            .then((response: ResponseData) => {
                socket.emit('updateChannel', this.channel.channelName);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async updateOwner(playerId: number, toAdd: boolean) {
            const data = {
                user: playerId as number,
                toAdd: toAdd as boolean,
            };
            return await ChannelDataService.updateOwner(this.channel.channelName, data)
            .then((response: ResponseData) => {
                socket.emit('updateChannel', this.channel.channelName);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        async updateMute(playerId: number, toAdd: boolean) {
            const data = {
                user: playerId as number,
                toAdd: toAdd as boolean,
            };
            await ChannelDataService.updateMuteList(this.channel.channelName, data)
                .then((response: ResponseData) => {
                    socket.emit('updateChannel', this.channel.channelName);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        },
        async updateBan(playerId: number, toAdd: boolean) {
            const data = {
                user: playerId as number,
                toAdd: toAdd as boolean,
            };
            await ChannelDataService.updateBanList(this.channel.channelName, data)
                .then(async (response: ResponseData) => {
                    socket.emit('updateChannel', this.channel.channelName);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        },
        async kickUser(playerId: number) {
            const data = {
                id: playerId as number,
            };
            await ChannelDataService.kickUser(this.channel.channelName, data)
                .then(async (response: ResponseData) => {
                    socket.emit('updateChannel', this.channel.channelName);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        },
        async delay(ms: number) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async checkMessages() {
            await this.getMessages();
            await this.getAllPlayersInChannel();

            let scrollBar = (this.$refs.ScrollBar) as any;
            if (scrollBar)
                scrollBar.scrollTop = scrollBar.scrollHeight;
        },
        async refreshChannel() {
            await this.getChannel();
            await this.getAllPlayersInChannel();
            await this.getBanList();
            await this.checkAccess();
        },
        async init() {
            this.isLoading = true;
            await this.getUser(Number(localStorage.getItem("user-id")));
            await this.refreshChannel();
            await this.getMessages();
            await this.checkMessages();
            this.isLoading = false;

            socket.emit('JoinChannel', this.channel.channelName);
            socket.on('refreshChannelMessages', (uuid: string) => {
                this.checkMessages();
            });
            socket.on('refreshChannelInfo', (uuid: string) => {
                this.refreshChannel();
            });
        },
        revealPassword() {
            var x = document.getElementById('update-password');
            if (x && x.style.display == "none") {
                x.style.display = "block";
            } else if (x && x.style.display == "block") {
                x.style.display = "none";
            }
            else if (x) {
                x.style.display = "block";
            }
        },
    },
    mounted() {
		SocketServices.connectGlobalSocketNotif(socket);
        this.revealPassword();
        this.init();
    },
});
</script>

<style scoped>
.channel-btn {
    display: flex;
    width: 350px;
    flex-wrap: wrap;
    justify-content: center;
}
.reveal-btn {
    color:black;
    background-color: lightgray;
    margin: auto;
    margin: 10px;
}
.channel-component {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-items: center;
}
.player-list-item img {
    width: 64px;
    height: 64px;
    border: 2px solid #ddd;
    border-radius: 100%;
}
.player-list ul {
    list-style: none;
    max-height: 800px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
}
.player-list-item {
    display: flex;
    align-items: center;
    width: 350px;
    border: 2px solid #ddd;
    border-radius: 10px;
    margin: 5px;
}
.list-item-content {
    margin-left: 10px;
    text-align: initial;
    width: 150px;
    margin-right: auto;
}
[class|="status"] {
    font-size: 15px;
    padding: 3px;
    margin-block: 2px;
    font-weight: bold;
}
.status-me {
    border: black solid 2px;
    width: 50%;
    text-align: center;
}
.status-owner {
    background-color: black;
    color: white;
}
.status-admin {
    background-color: gray;
    color: white;
}
.status-friend {
    background-color: #4bbd4b;
    color: white;
    width: 50%;
    text-align: center;
}
.status-mute {
    border: gray solid 2px;
    color: gray;
}
.profile-link {
    color: black;
    text-decoration: none;
}
.profile-link h4 {
    font-size: 18px;
    margin: 0;
}
.messages ul {
    height: 600px;
    width: 500px;
    padding: 0;
    list-style: none;
    margin-left: 3px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scroll-behavior: smooth;
}
.messages {
    border-bottom: solid black 1px;
}
.user-state {
    margin-inline: 5px;
}
.message-box {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-block: 2px;
}
.message-box h4 {
    font-size: 20px;
    margin: 5px;
}
.send-message-area {
    width: 100%;
}
.send-message-area textarea {
    width: 95%;
    padding: 12px 20px;
    margin: 5px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: #f8f8f8;
    font-size: 15px;
    resize: none;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
.match-btn {
    background-color: white;
    color: black;
    margin: 0;
    padding: 0;
}
.match-btn i {
    border: solid black 2px;
    border-radius: 100%;
    padding: 5px;
    margin-right: 5px;
    font-size: 25px;
    /* width: 25px; */
    /* height: 25px; */
}
.start-game {
    width: 50px;
}
.status-div {
    width: 100px;
    margin: 0;
}
.status-div button {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
    padding: 3px;
    width: 100%;
    border-radius: 10px;
    margin-block: 2px;
}
.admin-btn,
.add-admin-btn {
    color: grey;
    background-color: lightgray;
}
.remove-admin-btn {
    color: lightgray;
    background-color: grey;
}
.mute-btn {
    background-color: #eda942;
}
.unmute-btn {
    background-color: mediumseagreen;
}
.leave-btn,
.ban-btn {
    background-color: #f44336;
}
.mute-message-box {
    width: 350px;
    word-break: break-word;
}
.box-name {
    border-bottom:  1px solid black;
    width: 100%;
}
.ban-kick-div {
    display: flex;
    gap: 2px;
}
#update-password {
    display: none;
}
#mon_select {
    font-size: 15px;
    background-color: #f44336;
    color: white;
    padding: 5px;
}
</style>
