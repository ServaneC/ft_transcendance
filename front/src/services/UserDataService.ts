/* eslint-disable */
import http from "@/http-common";

class UserDataService {
  /////////
  // GET //
  /////////

  // USER
  getAll(): Promise<any> {
    return http.get("/users");
  }

  get(id: number): Promise<any> {
    return http.get(`/users/${id}`);
  }

  getAvatar(id: number): Promise<any> {
    return http.get(`/users/${id}/avatar`);
  }

  getAchievements(id: number): Promise<any> {
    return http.get(`/users/${id}/achievements`);
  }

  getMatchHistory(id: number): Promise<any> {
    return http.get(`/game/user/${id}`);
  }

  // AUTH
  login(data: any): Promise<any> {
    return http.get("/login", data);
  }

  get42Token(code: string) : Promise<any> {
    return http.get(`/auth/42?code=${code}`);
  }

  // USER RELATIONS
  getFriends(id: number): Promise<any> {
    return http.get(`/users/${id}/friends`);
  }

  getBlocked(id: number): Promise<any> {
    return http.get(`/users/${id}/blocked`);
  }

  getNonBlocked(id: number): Promise<any> {
    return http.get(`/users/${id}/non-block-users`);
  }

  //////////
  // POST //
  //////////

  // USER
  create(data: any): Promise<any> {
    return http.post("/users", data);
  }

  updateUserName(id: number, data: any) : Promise<any>{
    return http.post(`/users/name/${id}`, data);
  }

  uploadAvatar(id: number, avatar: FormData): Promise<any> {
    return http.post(`/users/avatar/${id}`, avatar);
  }

  // AUTH
  generateQRcode(data:any): Promise<any> {
    return http.post("/2fa/generate", data, { responseType: "arraybuffer" });
  }

  turn2FAon(data: any): Promise<any> {
    return http.post("/2fa/turn-on", data);
  }

  turn2FAoff(data: any): Promise<any> {
    return http.post("/2fa/turn-off", data);
  }

  authenticate2fa(data: any): Promise<any> {
    return http.post("/2fa/authenticate", data);
  }

  // USER RELATIONS
  updateFriends(id: number, data: any): Promise<any> {
    return http.post(`/users/friends/${id}`, data);
  }

  updateBlocked(id: number, data: any): Promise<any> {
    return http.post(`/users/block/${id}`, data);
  }

  updateWebsiteAdmin(data: any): Promise<any> {
    return http.post(`/users/admin`, data);
  }

  banFromSite(id: number): Promise<any> {
    return http.post(`/users/ban/${id}`);
  }

  unbanFromSite(id: number): Promise<any> {
    return http.post(`/users/unban/${id}`);
  }

  ////////////
  // DELETE //
  ////////////

  delete(id: number): Promise<any> {
    return http.delete(`/users/${id}`);
  }

  deleteAvatar(id: number): Promise<any> {
    return http.delete(`/users/${id}/avatar`);
  }
}

export default new UserDataService();
