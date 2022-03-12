export default interface CreateChannel {
	channelName: string;
	isPublic: boolean;
	password: string;
	owner: number;
}