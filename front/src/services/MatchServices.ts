/* eslint-disable */
import http from "@/http-common";

class MatchDataService {
	get(id: number): Promise<any> {
		return http.get(`/game/${id}`);
	}
}

export default new MatchDataService();
