<template>
	<BurgerMenu />
    
    <!-- FOR USER SELECTION -->
    <!-- <OwnerProfile @getUserSelected="HandleGetUserSelected"/>
    <PublicChannelList :user="user" v-if="this.userSelected"/> -->
    
    <!-- NO USER SELECTION -->
    <div v-if="isloading">
        Loading...
    </div>
    <div v-else>
        <MyProfile :user="user" />
        <PublicChannelList :user="user" />
    </div>

</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
import ResponseData from "@/types/ResponseData";
import UserDataService from "@/services/UserDataService";
import User from "@/types/User";
import OwnerProfile from '@/components/chat/OwnerProfile.vue';
import PublicChannelList from "@/components/chat/PublicChannelList.vue";
import MyProfile from "@/components/chat/MyProfile.vue"
import BurgerMenu from "@/components/chat/BurgerMenu/BurgerMenu.vue";
// import io from "socket.io-client";
// import SocketServices from "../services/SocketServices"

// const socket = io("http://localhost:3000", {
// 	auth: {
// 		token: localStorage.getItem('user-token'),
// 		userId: localStorage.getItem('user-id'),
// 		page: "chat"
// 	}
// });

export default defineComponent({
    name: "chat",
    data() {
        return {
            user: {} as User,
            userSelected: false,
            nbUsers: 0,
            isloading: {} as boolean,
        };
    },
    components: {
        OwnerProfile,
        PublicChannelList,
        BurgerMenu,
        MyProfile,
    },
    methods: {
        getUser(id: number) {
            this.isloading = true;
            UserDataService.get(id)
            .then((response: ResponseData) => {
                this.user = response.data;
                this.isloading = false;
            })
            .catch((e: Error) => {
                console.log(e);
            });
        },
        HandleGetUserSelected: function(value : User) {
            this.user = value;
            this.userSelected = true;

            // TMP debug with user
            localStorage.setItem("user-id", String(this.user.id));
            localStorage.setItem("user-name", this.user.userName);
        },
        refreshConnectedUsers() {
            UserDataService.getAll()
            .then((response: ResponseData) => {
                let nb = 0;
                for (let index = 0; index < response.data.length; index++) {
                    if (response.data[index].isActive) {
                        ++nb;
                    }
                }
                this.nbUsers = nb;
            })
            .catch((e: Error) => {
                console.log("Error: " + e);
            });
        },
    },
    mounted() {
		// SocketServices.connectGlobalSocketNotif(socket);
        this.getUser(Number(localStorage.getItem("user-id")));
    }
});
</script>
