export default interface User {
  id: number;
  userName: string;
  isActive: boolean;
  inGame: boolean;
  avatar: string;
  isTwoFAuthEnabled: boolean;
  achievements: number[];
  friends: number[];
  blockedUsers: number[];
  isWebsiteOwner: boolean;
  isWebsiteAdmin: boolean;
  isPermaBan: boolean;
  ladderLevel: number;
}
