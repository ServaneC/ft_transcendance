import { createRouter, createWebHistory } from "vue-router";
import http from "@/http-common";
import Vue from 'vue';

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../components/users/auth/Login.vue"),
    },
    {
        path: "/2FAuth",
        name: "two factor auth",
        component: () => import("../components/users/auth/twoFactorAuth.vue"),
    },
    {
        path: "/auth/42",
        name: "42 auth",
        component: () => import("../components/users/auth/Auth42.vue"),
    },
    {
        path: "/illegal-login",
        name: "illegal auth",
        component: () => import("../components/users/auth/IllegalLogin.vue"),
    },
    {
        path: "/2FLogin",
        name: "two factor login",
        component: () => import("../components/users/auth/TwoFALogin.vue"),
    },
    {
        path: "/ban",
        name: "ban",
        component: () => import("../components/users/auth/Ban.vue"),
    },
    {
        path: "/play",
        name: "Play",
        component: () => import("../views/Play.vue"),
    },
    {
        path: "/game/:id",
        name: "Game",
        component: () => import("../components/game/Game.vue"),
    },
    {
        path: "/chat",
        name: "Chat",
        component: () => import("../views/Chat.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/Profile.vue"),
    },
    {
        path: "/users",
        name: "users",
        component: () => import("../views/Users.vue"),
    },
    {
        path: "/users/:id",
        name: "user-details",
        component: () => import("../components/users/UserPublicProfile.vue"),
    },
    {
        path: "/update-profile",
        name: "update-profile",
        component: () => import("../components/users/UpdateProfile.vue"),
    },
    {
        path: "/Channel",
        name: "Channel",
        component: () => import("../components/chat/Channel/Channel.vue"),
        props: true,
    },
    {
        path: "/Channel/:channelName",
        name: "channelName",
        component: () => import("../components/chat/Channel/Channel.vue"),
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../components/admin/Admin.vue")
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import("../views/404.vue")
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("user-token");
    if (
        !token &&
        to.path !== "/login" &&
        to.path !== "/auth/42" &&
        to.path !== "/illegal-login" &&
        to.path !== "/2FLogin" &&
        to.path !== "/ban"
    )
    next({ path: "/login"});
    else {
        http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        next();
    }
});

export default router;
