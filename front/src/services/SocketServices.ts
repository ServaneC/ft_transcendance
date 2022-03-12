/* eslint-disable */
import { Socket } from 'socket.io-client';
import router from '@/router';


class SocketServices {
	connectGlobalSocketNotif(socket: Socket) {
        socket.on("friendMatchRequest", (uuid: string) => {
			console.log("match found | uuid : ", uuid);
			router.push("/game/" + uuid);
        });
    }
}

export default new SocketServices();
