/* eslint-disable */
import http from "@/http-common";
// import Channel from "@/types/Channel";
import CreateChannel from "@/types/CreateChannel";

class ChannelDataService {

    // CHANNEL
    // GET
    getAllActiveUser() : Promise <any> {
        return http.get('/users/');
    }
    getAllChannels() : Promise<any> {
        return http.get(`/channel`);
    }
    getAllPublicChannels() : Promise<any> {
        return http.get(`/channel/public`);
    }
    getAllUserChannel(userId: number): Promise<any> {
        return http.get(`/channel/user/${userId}`);
    }
    getChannel(channelName : string) : Promise<any> {
        return http.get(`/channel/infos/${channelName}`);
    }
    getAllUsersInChannel(channelName : string) : Promise<any> {
        return http.get(`/channel/users/${channelName}`);
    }
    getMessagesInChannel(channelName : string) : Promise<any> {
        return http.get(`/channel/messagesHistory${channelName}`);
    }
    getBanListUsers(channelName: string): Promise<any> {
        return http.get(`/channel/banlist/${channelName}`);
    }
    // POST
    createChannel(channel: CreateChannel) : Promise<any> {
        return http.post('/channel/createChannel', channel);
    }
    updateChannelUser(channelName : string, data: any) : Promise<any> {
        return http.post(`/channel/update-user/${channelName}`, data);
    }
    updateAdmin(channelName: string, data: any) : Promise<any> {
        return http.post(`/channel/admin/${channelName}`, data);
    }
    updateOwner(channelName: string, data: any) : Promise<any> {
        return http.post(`/channel/owner/${channelName}`, data);
    }
    updateMuteList(channelName: string, data: any) : Promise<any> {
        return http.post(`/channel/mute/${channelName}`, data);
    }
    updateBanList(channelName: string, data: any) : Promise<any> {
        return http.post(`/channel/ban/${channelName}`, data);
    }
    kickUser(channelName: string, data: any) : Promise<any> {
        return http.post(`/channel/kick/${channelName}`, data);
    }
    updatePassword(channelName: string, data: any): Promise<any> {
        return http.post(`/channel/password/${channelName}`, data);
    }
    // DELETE
    deleteChannel(channelName : string) : Promise<any> {
        return http.delete(`/channel/${channelName}`);
    }

    // MESSAGES
    //GET
    getMessagesFromChannel(channelName : string) : Promise<any> {
        return (http.get(`messages/${channelName}/msg`));
    }
    getMessageFromChannel(channelName: string, id : any) : Promise<any> {
        return http.get(`messages/${channelName}/msg/`, id);
    }
    // POST
    sendMessageToChannel(channelName: string, message: any) : Promise<any> {
        return http.post(`messages/${channelName}`, message);
    }

    // CONDITIONS

    channelExist(channelName: string) : Promise<any> {
        return http.get(`/channel/channel-exist/${channelName}`);
    }

    canJoinChannel(channelName: string, channelPassword: any) : Promise<any> {
        return http.post(`channel/join-channel/${channelName}`, channelPassword);
    }

    // JoinPrivateChannel(channelName: string, channelPassword: any) : Promise<any> {
    //     return http.post(`/channel/${channelName}/join-private-channel`, channelPassword);
    // }
}

export default new ChannelDataService();
