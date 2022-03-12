<template>
	<div class="create-channel-wrapper">
		<div class="create-channel">
			<h4>Create a new Channel</h4>
			<form>
				<div class="form-div">
				<label for="create-chanel-name" >Channel Name
				<input 
					type="text"
					minlength="1"
					maxlength="10"
					id="create-channel-name"
					v-model="this.channel.channelName"
				></label>
				</div>
				<div class="form-div">
					<label for="create-password">Password </label>
				 	<input v-if="showPassword == false" v-model="this.channel.password" id="create-password"  type="password" autocomplete="off" >
          			<input v-else v-model="this.channel.password" id="create-password" type="text" autocomplete="off" >
					<label class="eye-checkbox">
						<input type="checkbox" @change="togglePasswordVisibility"/>
						<i class="fas fa-eye checked"></i>
						<i class="fas fa-eye-slash unchecked"></i>
					</label>
				</div>
				<div class="form-div">
				<label for="public-channel">Public Channel
				<input
					id="public-channel"
					type="checkbox"
					v-model="this.channel.isPublic"
				></label>
				<p>(channel will be Private if not checked)</p>
				</div>
				<div class="form-div">
				<button class="create-button" type="button" name="button"
					@click="CreateChannel">
					Create
				</button>
				</div>
			</form>
		</div>
	</div>
	<div class="messages">
		<div class="error-message"
		v-if="this.state == 1">
			<p>{{ error }}</p>
		</div>
		<div class="success-message"
			v-if="this.state == 2">
			<p>Channel sucessfully created</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Vue from 'vue';
import http from '@/http-common';

import ChannelDataService from '@/services/ChannelDataService';
import ResponseData from "@/types/ResponseData";

import CreateChannel from "@/types/CreateChannel";
import User from "@/types/User";

export default defineComponent({
	data() {
		return {
			channel: {} as CreateChannel,
			error: {} as string,
			state: 0,
			isLoading: false as boolean,
			showPassword: false as boolean,
		}
	},
  props: {
      user: {
          type: Object as () => User,
          required: true,
      },
  },
	methods: {
		togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
		async delay(ms: number) {
			return new Promise( resolve => setTimeout(resolve, ms) );
		},
		async CreateChannel() {
			if (this.channel.channelName !== undefined) {
				if (this.channel.channelName.indexOf(' ') != -1) {
					this.state = 1;
					this.error = "Channel Name must not have any whitespaces !";
					return;
				}
				this.isLoading = true;
				this.state = 0;

				let data = {
					channelName: this.channel.channelName as string,
					password: this.channel.password as string,
					isPublic: this.channel.isPublic as boolean,
					owner: this.user.id as number,
				};

				ChannelDataService.createChannel(data)
				.then((response: ResponseData) => {
					this.state = 2;
					localStorage.setItem("channel-pwd", this.channel.password);
					this.$router.push("/Channel/" + this.channel.channelName);
					this.isLoading = false;
				})
				.catch((e) => {
					this.state = 1;
					this.error =  e.response.data.message;
					this.isLoading = false;
				});
				this.isLoading = false;
			} else {
				this.state = 1;
				this.error = "Please enter a channel name";
			}
		},
	},
	mounted() {
		this.channel.isPublic = false;
	},
});
</script>

<style  scoped>
h4 {
    margin: 0;
}
.create-channel {
	display: flex;
	flex-direction: column;
    align-items: center;
	gap: 10px;
}
.messages {
	font-size: 20px;
}
.success-message {
	color: green;
}
.error-message {
	color: red;
}
.create-button {
	background-color: #4bbd4b;
}
.form-div {
	margin: 10px;;
}
.form-div p {
	margin: 0;
	font-size: 12px;
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