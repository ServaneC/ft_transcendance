<template>
	<div v-if="channel.isProtected" class="owner-form">
		<form>
			<h3>This channel is protected by a password </h3>
			<!-- <label for="password">Current Password </label> -->
			<input v-if="!showPassword" v-model="currentPassword" id="password" placeholder="Current Password"  type="password" autocomplete="off">
			<input v-else v-model="currentPassword" id="password" placeholder="Current Password" type="text" autocomplete="off">
			<label class="eye-checkbox">
				<input type="checkbox" @change="togglePasswordVisibility"/>
				<i class="fas fa-eye checked"></i>
				<i class="fas fa-eye-slash unchecked"></i>
			</label>
			<p class="error-message">{{ error }}</p>
			<div class="protected-form">
				<div class="update-password">
					<input v-if="!showPassword" v-model="password" id="update-password" placeholder="New Password"  type="password" autocomplete="off">
					<input v-else v-model="password" id="update-password" placeholder="New Password" type="text" autocomplete="off">
					<button class="update-btn" type="button" name="button" @click="updatePassword(true)">Update Password</button>
				</div>
				<div class="delete-password">
					<button class="delete-btn" type="button" name="button" @click="updatePassword(false)">Remove Password</button>
				</div>
			</div>
		</form>
	</div>
	<div v-else class="owner-form">
		<form>
			<h3>There is currently no password on this channel</h3>
			<label for="password">Add a Password </label>
			<input v-if="!showPassword" v-model="password" id="password" placeholder="password to set"  type="password" autocomplete="off">
			<input v-else v-model="password" id="password" placeholder="password to set" type="text" autocomplete="off">
			<label class="eye-checkbox">
				<input type="checkbox" @change="togglePasswordVisibility"/>
				<i class="fas fa-eye checked"></i>
				<i class="fas fa-eye-slash unchecked"></i>
			</label>
		</form>
		<button type="button" name="button" @click="updatePassword(true)">Set Password</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Channel from "@/types/Channel";
import User from "@/types/User";
import ResponseData from "@/types/ResponseData";
import ChannelDataService from "@/services/ChannelDataService";

export default defineComponent({
	data() {
		return {
			error: "" as string,
			showPassword: false as boolean,
			currentPassword: "" as string,
			password: "" as string,
		}
	},
	props: {
		channel: {
			type: Object as () => Channel,
			required: true,
		},
		user: {
			type: Object as () => User,
			required: true,
    	},
	},
	methods: {
		togglePasswordVisibility() {
      		this.showPassword = !this.showPassword;
    	},
		async updatePassword(toAdd: boolean) {
			if (toAdd && (!this.password || this.password == undefined))
				this.error = "You must enter a new password to set";
			else if (this.channel.isProtected && (!this.currentPassword || this.currentPassword == undefined))
				this.error = "You must enter the current password";
			else {
				const data = {
					currentPassword: this.currentPassword as string,
					newPassword: this.password as string,
					toAdd: toAdd as boolean,
				};
				await ChannelDataService.updatePassword(this.channel.channelName, data)
					.then((response: ResponseData) => {
						localStorage.setItem("channel-pwd", this.password);
						this.$router.go(0);
					})
					.catch((e: Error) => {
						console.log(e);
				});
			}
		},
	},
});
</script>

<style scoped>
input[type="text"],
input[type="password"] {
  padding: 6px;
}
.protected-form {
	display: flex;
	align-items: center;
    margin-top: 10px;
}
.update-password {
    padding-top: 20px;
    padding-top: 10px;
	width: 50%;
}
.update-password input {
	width: 135px;
}
.delete-password {
	margin: auto;
}
.owner-form {
	background-color: lightgray;
	padding: 10px;
	width: 350px;
}
.owner-form h3 {
	margin-top: 0;
	font-size: 20px;
}
.owner-form p {
	margin: 0;
}
.error-message {
	color: #f44336;
	margin: 0;
}
.delete-btn {
    background-color: #f44336;
	width: 100px;
}
.update-btn {
	font-size: 15px;
	width: 135px;
	background-color: gray;
}
.eye-checkbox {
    margin-inline: 5px;
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