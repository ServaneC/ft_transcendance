<template>
	<div class="join-private-channels">
		<h4>Join private Channel</h4>
		<form>
			<div class="form-div">
				<label for="chanel-name" >Channel Name
				<input 
					type="text"
					required
					minlength="1"
					maxlength="10"
					id="channel-name"
					v-model="joinChannel.channelName"
				></label>
			</div>
			<div class="form-div">
				<label for="password">Password </label>
          <input v-if="showPassword == false" v-model="password" id="password"  type="password" autocomplete="off" >
          <input v-else v-model="password" id="password" type="text" autocomplete="off" >
					<label class="eye-checkbox">
              <input type="checkbox" @change="togglePasswordVisibility"/>
              <i class="fas fa-eye checked"></i>
              <i class="fas fa-eye-slash unchecked"></i>
          </label>
			</div>
			<div class="form-div">
				<button type="button" class="join-btn"
					@click="JoinPrivateChannel(password)">Join Channel
				</button>
			</div>
		</form>
	</div>
	<div class="error-message" v-if="error">
			<p>{{ error }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Channel from "@/types/Channel";
import User from "@/types/User";

import ChannelDataService from '@/services/ChannelDataService';
import ResponseData from "@/types/ResponseData";

export default defineComponent({
	name: "join-private-channel",
	data() {
		return {
			joinChannel: {} as Channel,
			channel: {} as Channel,
			error: "" as string,
			password: "" as string,
			showPassword: false as boolean,
		};
	},
	props: {
		userId: {
			type: Number,
			required: true,
		},
	},
	methods: {
		togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
		async getChannel(name: string) {
			console.log("getChannels private ");
			await ChannelDataService.getChannel(name)
			.then((response: ResponseData) => {
				this.channel = response.data.channel;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		async addUserChannel(channel : Channel) {
      const data = {
          user: this.userId as number,
          toAdd: true,
      };
      await ChannelDataService.updateChannelUser(this.channel.channelName, data)
      .catch((e: Error) => {
          console.log(e);
      });
    },
		async JoinPrivateChannel(current_password: string) {
			let data = {
				password: current_password,
			};
			await this.getChannel(this.joinChannel.channelName);
			await ChannelDataService.canJoinChannel(this.channel.channelName, data)
			.then(async (response : ResponseData) => {
        if (this.channel.users.indexOf(this.userId) == -1) {
          await this.addUserChannel(this.channel);
        }
        localStorage.setItem("channel-pwd", current_password);
				this.$router.push("/Channel/" + this.channel.channelName);
			})
      		.catch((e) => {
							this.error =  e.response.data.message;
          		console.log("Error: " + e.response.data.message);
      		});
		},
	}
});
</script>

<style scoped>
h4 {
    margin: 0;
}
.form-div {
	margin: 10px;
}
.join-private-channels {
	display: flex;
	flex-direction: column;
    align-items: center;
	gap: 10px;
}
.error-message {
	color: red;
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
