<template id="burger">

    <!-- boxicons Css -->
    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    -->

    <!-- boxicons Css -->
    <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
    <div class="burger-menu">

        <div class="sidebar">
            <div class="logo-details">
                <i class='bx bx-football icon' ></i>
                <div class="logo_name">Transcendence</div>
                <i class='bx bx-menu' id="btn" ></i>
            </div>


            <ul class="nav-list">
            <hr class="hr_element">
                <!--
                <li class="element">
                    <i class='bx bx-search' ></i>
                    <input class="search-bar" type="text" placeholder="Search...">
                    <span class="tooltip">Search</span>
                </li>
            -->
                <li class="element">
                    <router-link :to="'/Play/'">
                        <i class='bx bx-grid-alt'></i>
                        <span class="links_name">Dashboard</span>
                    </router-link>
                    <span class="tooltip">Dashboard</span>
                </li>

                <li class="element">
                    <router-link to="/profile">
                        <i class='bx bx-user' ></i>
                        <span class="links_name">Profile</span>
                    </router-link>
                    <span class="tooltip">Profile</span>
                </li>
                <li class="element">
                    <!-- Notifications -->
                    <span class="round-circle" v-if="this.nbNotifications >= 0">
                        <p>{{ this.nbNotifications }}</p>
                    </span>
                    <router-link to="#">
                        <i class='bx bx-chat' ></i>
                        <span class="links_name">Messages</span>
                    </router-link>
                    <span class="tooltip">Messages</span>
                </li>
                <li class="element">
                    <!-- Achievements -->
                    <span class="round-circle" v-if="this.nbAchievements >= 0">
                        <p>{{ this.nbAchievements }}</p>
                    </span>
                    <router-link to="#">
                        <i class='bx bx-trophy' ></i>
                        <span class="links_name">Achievements</span>
                    </router-link>
                    <span class="tooltip">Achievements</span>
                </li>
                <li class="element">
                    <router-link to="#">
                        <i class='bx bx-cog' ></i>
                        <span class="links_name">Settings</span>
                    </router-link>
                    <span class="tooltip">Settings</span>
                </li>
                <!--
                <li class="li_log_out">
                    <i class='bx bx-log-out' id="log_out" ></i>
                </li>
                -->
                <hr class="hr_element">

                <span class="sep_friends">
                    <i class='bx bxs-user-circle'></i>
                </span>

                <div class="friend_list">
                    <li v-for="friend in FriendList"  :key="friend" class="element" on>
                        <span :class='friend.isActive ? "round-circle-online" : "round-circle-offline"'></span>
                        <span :class='friend.isActive ? "round-circle-sub-online" : "round-circle-sub-offline"'></span>
                    <router-link :to="'/users/' + friend.id">
                        <Avatar :user="friend" class="friend_image"/>
                        <span class="links_name">{{ friend.userName }}</span>
                    </router-link>
                        <span class="tooltip">{{ friend.userName }}</span>
                    </li>
                </div>

            </ul>
        </div>

    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
import Vue from 'vue';
import User from "@/types/User";
import ChannelDataService from "@/services/ChannelDataService";
import UserDataService from "@/services/UserDataService";
import ResponseData from "@/types/ResponseData";
import Avatar from "@/components/users/Avatar.vue";

export default defineComponent({
    name: "burger-menu",
    data() {
        return {
            user: {} as User,
            FriendList: [] as User[],
            nbNotifications: 0,
            nbAchievements: 0,
        };
    },
    components: {
        Avatar,
    },
    methods: {
        async getUser(id: number) {
            await UserDataService.get(id)
            .then((response: ResponseData) => {
                this.user = response.data;
            })
            .catch((e: Error) => {
                console.log(e);
                console.log("Error !");
            });
        },
        async getFriends(id: number) {
            await UserDataService.getFriends(id)
            .then((response: ResponseData) => {
                this.FriendList = response.data;
                this.FriendList.sort((a, b) => (a.userName > b.userName ? -1 : 1));
                this.FriendList.sort((a, b) => (a.isActive && !b.isActive ? -1 : 1));
            })
            .catch((e: Error) => {
                console.log(e);
                console.log("Error !");
            });
        },
        async init() {
            console.log("UserID: " + Number(localStorage.getItem("user-id")));
            await this.getUser(Number(localStorage.getItem("user-id")));
            await this.getFriends(Number(localStorage.getItem("user-id")));
            console.log("Friend list: " + this.FriendList);
        },
        initMenuBurger() {

            let sidebar = document.querySelector(".sidebar") as any;
            let closeBtn = document.querySelector("#btn") as any;
            //let searchBtn = document.querySelector(".bx-search") as any;

            closeBtn.addEventListener("click", () =>{
                sidebar.classList.toggle("open");
                menuBtnChange();//calling the function(optional)
            });

            /*
            searchBtn.addEventListener("click", () =>{ // Sidebar open when you click on the search iocn
                sidebar.classList.toggle("open");
                menuBtnChange(); //calling the function(optional)
            });
            */

            document.getElementById('btn');
            // following are the code to change sidebar button(optional)
            function menuBtnChange() {
                if(sidebar.classList.contains("open")){
                    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
                }else {
                    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
                }
            }
        },
    },
    mounted() {
        console.log("Mount BurgerMenu");

        this.init();
        this.initMenuBurger();
    },
});
</script>

<style media="screen">
/* Google Font Link */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

/*
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins" , sans-serif;
}
*/

.sidebar{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 78px;
    background: #11101D;
    padding: 6px 14px;
    z-index: 99;
    transition: all 0.25s ease;
}
.sidebar.open{
    width: 250px;
}
.sidebar .logo-details{
    height: 60px;
    display: flex;
    align-items: center;
    position: relative;
}
.sidebar .logo-details .icon{
    opacity: 0;
    transition: all 0.25s ease;
}
.sidebar .logo-details .logo_name{
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    opacity: 0;
    transition: all 0.25s ease;
}
.sidebar.open .logo-details .icon,
.sidebar.open .logo-details .logo_name{
    opacity: 1;
}
.sidebar .logo-details #btn{
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 22px;
    transition: all 0.4s ease;
    font-size: 23px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    left: calc(78px / 2);
}
.sidebar.open .logo-details #btn{
    text-align: right;
}
.sidebar i{
    color: #fff;
    height: 60px;
    min-width: 50px;
    font-size: 28px;
    text-align: center;
    line-height: 60px;
}
.sidebar .nav-list{
    margin-top: 20px;
    height: 100%;
}
.sidebar li{
    position: relative;
    margin: 8px 0;
    list-style: none;
}
.sidebar .element {
    margin-left: -30px;
}
.sidebar li .tooltip{
    position: absolute;
    top: -20px;
    left: calc(100% + 15px);
    z-index: 3;
    background: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 400;
    opacity: 0;
    white-space: nowrap;
    pointer-events: none;
    transition: 0s;
}
.sidebar li:hover .tooltip{
    opacity: 1;
    pointer-events: auto;
    transition: all 0.4s ease;
    top: 50%;
    transform: translateY(-50%);
}
.sidebar.open li .tooltip{
    display: none;
}
.sidebar input{
    font-size: 15px;
    color: #FFF;
    font-weight: 400;
    outline: none;
    height: 50px;
    width: 100%;
    width: 50px;
    border: none;
    border-radius: 12px;
    transition: all 0.25s ease;
    background: #1d1b31;
}
.sidebar.open input{
    padding: 0 20px 0 50px;
    width: 100%;
}
.sidebar .bx-search{
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 22px;
    background: #1d1b31;
    color: #FFF;
}
.sidebar.open .bx-search:hover{
    background: #1d1b31;
    color: #FFF;
}
.sidebar .bx-search:hover{
    background: #FFF;
    color: #11101d;
}
.sidebar li a{
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 12px;
    align-items: center;
    text-decoration: none;
    transition: all 0.4s ease;
    background: #11101D;
}
.sidebar li a:hover{
    background: #FFF;
}
.sidebar li a .links_name{
    color: #fff;
    font-size: 15px;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: 0.4s;
}
.sidebar.open li a .links_name{
    opacity: 1;
    pointer-events: auto;
}
.sidebar li a:hover .links_name,
.sidebar li a:hover i{
    transition: all 0.25s ease;
    color: #11101D;
}
.sidebar li i{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    border-radius: 12px;
}
.sidebar li.li_log_out{
    position: fixed;
    height: 60px;
    width: 78px;
    left: 0;
    bottom: -8px;
    padding: 10px 14px;
    background: #1d1b31;
    transition: all 0.25s ease;
    overflow: hidden;
    z-index: 4;
}
.sidebar.open li.li_log_out{
    width: 250px;
}
.sidebar li .li_log_out-details{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
}
.sidebar li img{
    height: 45px;
    width: 45px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 10px;
}
.sidebar li.li_log_out .name,
.sidebar li.li_log_out .job{
    font-size: 15px;
    font-weight: 400;
    color: #fff;
    white-space: nowrap;
}
.sidebar li.li_log_out .job{
    font-size: 12px;
}
.sidebar .li_log_out #log_out{
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background: #1d1b31;
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-radius: 0px;
    transition: all 0.25s ease;
}
.sidebar.open .li_log_out #log_out{
    width: 50px;
    background: none;
}
.home-section{
    position: relative;
    background: #E4E9F7;
    min-height: 100vh;
    top: 0;
    left: 78px;
    width: calc(100% - 78px);
    transition: all 0.25s ease;
    z-index: 2;
}
.sidebar.open ~ .home-section{
    left: 250px;
    width: calc(100% - 250px);
}
.home-section .text{
    display: inline-block;
    color: #11101d;
    font-size: 25px;
    font-weight: 500;
    margin: 18px
}
@media (max-width: 420px) {
    .sidebar li .tooltip{
        display: none;
    }
}

/* NOTIFICATIONS (Round circle) */

.round-circle {
    display: inline-block;
    position: absolute;
    height: 18px;
    width: 18px;
    background-color: rgb(240, 62, 62);
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}
.round-circle p {
    position: absolute;
    margin: 0;
    color: #fff;
    font-weight: 500;
    font-family: "Poppins" , sans-serif;
    font-size: 12px;
    text-align: center;
    padding-left: 5px;
    margin-top: 0px;
}

.hr_element {
    display: block;
    position: relative;
    width: calc(100% + 78px / 2);
    margin: 0;
    left: calc(-78px / 2);
    transform: translateY(-50%);
}

/* Friends Separator */

.sep_friends {

    display: block;
    position: relative;

    background: #1d1b31;
    width: 100%;
    height: 64px;
    left: 0px;
    margin-left: 0px;

    position: absolute;
    top: 450px;
    right: 0;
    transform: translateY(-50%);
    font-size: 22px;
    font-size: 23px;
    text-align: center;
    transition: all 0.25s ease;
}

/* Friends list */

.friend_list {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 500px;
    left: -22px;
    width: calc(100% + 50px / 2);
    margin-top: calc(78px * 2 / 1.5);
    transition: all 0.25s ease;
    text-align: center;
    overflow-y: scroll;
    scroll-behavior: smooth;
}

.friend_image {
    border-radius: 12px;
    margin-left: 25px;
}

/* Friends status */

.round-circle-online {
    display: inline-block;
    position: absolute;
    height: 18px;
    width: 18px;
    background-color: rgb(123, 237, 95);
    background-color: white;
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.round-circle-sub-online {
    display: inline-block;
    position: absolute;
    height: 14px;
    width: 14px;
    background-color: rgb(123, 237, 95);
    border-radius: 50%;
    z-index: 2;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    transform: translate(2px, 2px);
}

.round-circle-ingame {
    display: inline-block;
    position: absolute;
    height: 18px;
    width: 18px;
    background-color: rgb(0, 150, 255);
    background-color: white;
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.round-circle-sub-ingame {
    display: inline-block;
    position: absolute;
    height: 14px;
    width: 14px;
    background-color: rgb(0, 150, 255);
    border-radius: 50%;
    z-index: 2;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    transform: translate(2px, 2px);
}

.round-circle-offline {
    display: inline-block;
    position: absolute;
    height: 18px;
    width: 18px;
    background-color: rgb(240, 62, 62);
    background-color: white;
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.round-circle-sub-offline {
    display: inline-block;
    position: absolute;
    height: 14px;
    width: 14px;
    background-color: rgb(240, 62, 62);
    border-radius: 50%;
    z-index: 2;
    pointer-events: none;
    margin-left: -30px;
    left: 30px;
    z-index: 3;
    transform: translate(2px, 2px);
}
.search-bar {
    max-width: 150px;
}



</style>
