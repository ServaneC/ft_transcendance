import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserNameDto } from './dto/update-userName.dto';
import { User } from './user.entity';
import * as fs from 'fs';
import { enumAchievements, allAchievement } from 'src/achievements/achievements';
import { AchievementsInterface } from 'src/achievements/achievements';
import { MatchService } from 'src/match/match.service';
import { Match } from 'src/match/match.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
      const user = new User();
      user.userName = createUserDto.userName;
      user.id = createUserDto.id;
      user.ladderLevel = 10;
      user.achievements = [];
      user.friends = [];
      user.blockedUsers = [];
      return await this.usersRepository.save(user);
  }

  ///////////
  // Utils //
  ///////////

  async setAchievementAsync(userId: number, achiev: enumAchievements): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (user.achievements.indexOf(achiev) === -1)
    {
      user.achievements.push(achiev);
      await this.usersRepository.save(user);
    }
    return user;
  }

  // to use only if this.usersRepository.save(user); after
  setAchievement(user: User, achiev: enumAchievements) {
    if (user.achievements.indexOf(achiev) === -1) {
      user.achievements.push(achiev);
    }
  }

  async getUsersInTab(usersIds: number[]): Promise<User[]> {
    const users = await this.usersRepository.find({
      id: In(usersIds),
    });
    return users;
  }

  async updateAdmin(userId: number, toAdd: boolean) {
    if (toAdd) {
      return this.usersRepository.save({
        id: userId,
        isWebsiteAdmin: true,
      })
    }
    else {
      return this.usersRepository.save({
        id: userId,
        isWebsiteAdmin: false,
      })
    }
  }
  
  /////////////////////////////////////////
  // Recherche et gestion d'utilisateurs //
  /////////////////////////////////////////
  
  async findOrCreate(id: number, userName: string) : Promise<any> {
    let user = await this.findOne(id);
    if (!user || user == undefined) {
      user = await this.create({"userName": userName, "id": id});
      return {
        user: user,
        isCreated: true,
      }
    }
    return {
      user: user,
      isCreated: false,
    }
  }
  
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    return user;
  }
  
  async remove(id: number): Promise<void> {
    await this.DeleteOldAvatarFile(id);
    await this.usersRepository.delete(id);
  }

  async banFromSite(id: number) : Promise<void> {
    await this.usersRepository.update(id, {
      "isPermaBan": true,
      "isWebsiteAdmin": false
    });
  }
  async unbanFromSite(id: number) : Promise<void> {
    await this.usersRepository.update(id, {"isPermaBan": false});
  }
  
  async userExists(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(id);
    if (user)
      return true;
    return false;
  }
  
  async userNameAlreadyExists(name: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ userName: name });
    if (user)
    return true;
    return false;
  }
  
  ///////////////////////
  // Gestion du profil //
  ///////////////////////
  
  // AVATAR //
  async setAvatar(id: number, avatarUrl: string): Promise<User>  {
    this.DeleteOldAvatarFile(id);
    const tmp = await this.usersRepository.update(id, {avatar: avatarUrl});
    return this.setAchievementAsync(id, enumAchievements.UPLOAD_AVATAR);
  }
  
  async getAvatar(id: number) : Promise<String>  {
    return await this.usersRepository.findOne(id).then((user) => { return user.avatar; });
  }
  
  async DeleteOldAvatarFile (id: number) {
    const myAvatar = await this.usersRepository.findOne(id).then((user: User) => { return user.avatar;});
    if (myAvatar)
    {
      fs.unlink("avatars/" + myAvatar, (err) => {
        if (err) 
          console.log(err);
      });
    }
  }
  
  async removeAvatar(id: number): Promise<void> {
    await this.DeleteOldAvatarFile(id);
    await this.usersRepository.update(id, {avatar: null});
  }
  
  // Other //
  async updateUserName(id: number, updateUserNameDto: UpdateUserNameDto): Promise<User> {
    await this.usersRepository.update(id, {userName: updateUserNameDto.newUserName});
    return this.setAchievementAsync(id, enumAchievements.CHANGE_NAME);
  }
  
  async updateLogState(id: number, isLog: boolean): Promise<User> {
    await this.usersRepository.update(id, {isActive: isLog});
    return await this.usersRepository.findOne(id);
  }

  async updateGameState(id: number, isInGame: boolean): Promise<User> {
    await this.usersRepository.update(id, {inGame: isInGame});
    return await this.usersRepository.findOne(id);
  }
  
  async getAchievements(id: number): Promise<AchievementsInterface[]> {
    const user = await this.usersRepository.findOne(id);
    let achievements: AchievementsInterface[] = [];
    user.achievements.forEach( achiev_id => {
      achievements.push(allAchievement[allAchievement.map(x => x.id).indexOf(achiev_id)]);
    });
    achievements.reverse();
    return achievements;
  }
  
  ///////////////////
  // Match History //
  ///////////////////
  async findAllPlayersMatchHistory(userId: number, matches: Match[]): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].playerOne != userId)
        users.push(await this.findOne(matches[i].playerOne));
      else if (matches[i].playerTwo != userId)
        users.push(await this.findOne(matches[i].playerTwo));
    }
    return users;
  }

  async updateLadderLevel(winnerId: number, loserId: number) : Promise<void> {
    const winner = await this.usersRepository.findOne(winnerId);
    const loser = await this.usersRepository.findOne(loserId);
    var newLoserLevel = loser.ladderLevel - 5;
    if (newLoserLevel < 0)
      newLoserLevel = 0;
    var newWinnerLevel = winner.ladderLevel + 10;
    await this.usersRepository.update(winnerId, { ladderLevel: newWinnerLevel });
    await this.usersRepository.update(loserId, { ladderLevel: newLoserLevel });
  }
  
  //////////////////////////////////
  // Relations entre Utilisateurs //
  //////////////////////////////////
  
  async getFriends(id: number):  Promise<User[]> {
    const user = await this.usersRepository.findOne(id);
    return this.getUsersInTab(user.friends);
  }

  async getBlocked(id: number):  Promise<User[]> {
    const user = await this.usersRepository.findOne(id);
    return this.getUsersInTab(user.blockedUsers);
  }

  async getUsersexceptBlocked(id:number): Promise<User[]> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      return [] as User[];
    const users = await this.usersRepository.find({
      where: {
        id: Not(In(user.blockedUsers))
      }
    });
    return users;
  }

  // Ajout de l'utilisateur
  async addAsFriend(userId: number, id: number) : Promise<string> {
    const user = await this.usersRepository.findOne(userId);

    if (user.blockedUsers.indexOf(id) !== -1)
      return "You can't add a blocked user as friend";
    if (user.friends.indexOf(id) === -1) {
      user.friends.push(id);
      if (user.friends.length > 0)
        this.setAchievement(user, enumAchievements.ADD_ONE_FRIEND);
      if (user.friends.length >= 3)
        this.setAchievement(user, enumAchievements.ADD_3_FRIEND);
      if (user.friends.length >= 5)
        this.setAchievement(user, enumAchievements.ADD_5_FRIEND);
      if (user.friends.length >= 10)
        this.setAchievement(user, enumAchievements.ADD_10_FRIEND);
      if (user.friends.length >= 50)
        this.setAchievement(user, enumAchievements.ADD_50_FRIEND);
      if (user.friends.length >= 100)
        this.setAchievement(user, enumAchievements.ADD_100_FRIEND);
      await this.usersRepository.save(user);
      return "Successfully added to your friends";
    }
    else
      return "Is already your friend";
  }

  // Retrait de l'utilisateur
  async removeFromFriends(userId: number, id: number) : Promise<string> {
    const user = await this.usersRepository.findOne(userId);
    if (user.friends.indexOf(id) === -1)
      return "This user is not in your friends list";
    else {
      user.friends.splice(user.friends.indexOf(id), 1);
      await this.usersRepository.save(user);
      return "Successfully removed from your friends list";
    }
  }

  async addAsBlocked(userId: number, blockedId: number) : Promise<string> {
    const user = await this.usersRepository.findOne(userId);
    await this.removeFromFriends(userId, blockedId);
    if (user.blockedUsers.indexOf(blockedId) === -1)
    {
      if (user.friends.indexOf(blockedId) !== -1)
        user.friends.splice(user.friends.indexOf(blockedId), 1);
      user.blockedUsers.push(blockedId);
      if (user.blockedUsers.length > 0)
        this.setAchievement(user, enumAchievements.BLOCK_ONE_USER);
      if (user.blockedUsers.length >= 3)
        this.setAchievement(user, enumAchievements.BLOCK_3_USER);
      if (user.blockedUsers.length >= 5)
        this.setAchievement(user, enumAchievements.BLOCK_5_USER);
      if (user.blockedUsers.length >= 10)
        this.setAchievement(user, enumAchievements.BLOCK_10_USER);
      if (user.blockedUsers.length >= 50)
        this.setAchievement(user, enumAchievements.BLOCK_50_USER);
      if (user.blockedUsers.length >= 100)
        this.setAchievement(user, enumAchievements.BLOCK_100_USER);
      await this.usersRepository.save(user);
      return "Successfully Blocked";
    }
    else
      return "Is already Blocked";
  }
  
  async removeFromBlocked(userId: number, blockedId: number) : Promise<string> {
    const user = await this.usersRepository.findOne(userId);
    if (user.blockedUsers.indexOf(blockedId) === -1)
      return "This user is not Blocked";
    else {
      user.blockedUsers.splice(user.blockedUsers.indexOf(blockedId), 1);
      this.setAchievement(user, enumAchievements.UNBLOCK_AN_USER);
      await this.usersRepository.save(user);
      return "Successfully Unblocked";
    }
  }
  
  //////////////////////////////////
  // Authentifiction a 2 facteurs //
  //////////////////////////////////
  
  async settwoFAuthSecret(secret: string, id: number) {
    return await this.usersRepository.update(id, {
      twoFAuthSecret: secret
    });
  }

  async turnOnTwoFAuth(id: number) {
    const user = await this.setAchievementAsync(id, enumAchievements.ACTIVATE_2FA);
    return this.usersRepository.update(id, {
      isTwoFAuthEnabled: true
    });
  }

  async turnOffTwoFAuth(id: number) {
    return await this.usersRepository.update(id, {
      isTwoFAuthEnabled: false
    });
  }
}
