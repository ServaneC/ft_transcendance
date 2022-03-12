import { Body, Controller, Delete, Get, Res, Param, Post, UploadedFile, UseInterceptors, NotFoundException,  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/utils/public.decorator';
import { UpdateUserNameDto } from './dto/update-userName.dto';
import { AchievementsInterface } from 'src/achievements/achievements';
import { UpdateUserDto } from '../chat/channel/dto/update-user.dto';
import { UV_FS_O_FILEMAP } from 'constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ------ // 
  //  POST  //
  // ------ // 
  
  // -> create a new user
  @Post()
  @Public()
  async addUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    if (await this.usersService.userExists(createUserDto.id)){
        return res.status(HttpStatus.CONFLICT).json({
            message: "User already exists"
        })
    }
    if (await this.usersService.userNameAlreadyExists(createUserDto.userName))
      return res.status(HttpStatus.CONFLICT).json({
          message: "User Name is already taken"
        })
    const user = await this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      message: "User has been created successfully",
      user
    })
  }
    
  @Post('admin')
  async updateAdmin(@Res() res, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.user && await this.usersService.updateAdmin(updateUserDto.user, updateUserDto.toAdd)) {
        return res.status(HttpStatus.OK).json({
          message: "Admin updated"
      })
    }
  }

  // -> update user name
  @Post('name/:id')
  async updateUserName(@Res() res, @Param('id') id: number, @Body() updateUserNameDto: UpdateUserNameDto): Promise<User> {
    if (await this.usersService.userNameAlreadyExists(updateUserNameDto.newUserName)) {
      return res.status(HttpStatus.CONFLICT).json({
        message: "User Name is already taken"
      })
    }
    const user = await this.usersService.updateUserName(id, updateUserNameDto);
    return res.status(HttpStatus.OK).json({
      message: "User Name has been successfully updated",
      user
    })
  }

  // -> add / replace avatar picture
  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('avatar',
  {
    storage: diskStorage({
      destination: './avatars',
      filename: (req, file, cb) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
      return cb(null, `${randomName}${extname(file.originalname)}`)
    }
    })
  }))
  async uploadAvatar(@Res() res, @Param('id') id: number, @UploadedFile() file): Promise<User>  {
    const user = await this.usersService.setAvatar(id, `${file.filename}`);
    return res.status(HttpStatus.OK).json({
      message: "Avatar has been successfully uploaded",
      user: user,
    })
  }

  // -> add user as friend
  @Post('friends/:id')
  async updateFriend(@Res() res, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.toAdd) {
      const message = await this.usersService.addAsFriend(id, updateUserDto.user);
      return res.status(HttpStatus.OK).json({
        message: message
      })
    }
    else {
      const message = await this.usersService.removeFromFriends(id, updateUserDto.user);
      return res.status(HttpStatus.OK).json({
        message: message
      })
    }
  }

  // -> block an user
  @Post('block/:id')
  async updateBlock(@Res() res, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    let message;
    if (updateUserDto.toAdd) {
      message = await this.usersService.addAsBlocked(id, updateUserDto.user);
    }
    else {
      message = await this.usersService.removeFromBlocked(id, updateUserDto.user);
    }
    return res.status(HttpStatus.OK).json({
      message: message
    })
  }

  // -> ban the user from the site
  @Post('ban/:id')
  async banFromSite(@Param('id') id: number): Promise<void> {
    return await this.usersService.banFromSite(id);
  }

  // -> unban the user from the site
  @Post('unban/:id')
  async unbanFromSite(@Param('id') id: number): Promise<void> {
    return await this.usersService.unbanFromSite(id);
  }


  // ------ // 
  //   GET  //
  // ------ // 

  // -> get all users
  // @Public()
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  // -> get one user
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  // -> get all achievements 
  @Get(':id/achievements')
  getAchievements(@Param('id') id: number): Promise<AchievementsInterface[]> {
    return this.usersService.getAchievements(id);
  }

  // -> get one user Friends
  @Get(':id/friends')
  async getFriends(@Param('id') id: number): Promise<User[]> {
    return await this.usersService.getFriends(id);
  }

  // -> get one user Blocked Users
  @Get(':id/blocked')
  async getBlocked(@Param('id') id: number): Promise<User[]> {
    return await this.usersService.getBlocked(id);
  }

  // -> get all users except blocked ones
  @Get(':id/non-block-users')
  async getUsersexceptBlocked(@Param('id') id: number): Promise<User[]> {
    return await this.usersService.getUsersexceptBlocked(id);
  }
  // -> logout 
  @Get('logout/:id')
  async logout(@Param('id') id: number): Promise<User> {
    return await this.usersService.updateLogState(id, false);
  }

  // -> get avatar picture (should be the only public request)
  @Public()
  @Get(':id/avatar')
  serveAvatar(@Param('id') id: number, @Res() res) : Promise<any> {
    const getAvatarFile = async () => {
      const avatarPath = await this.usersService.getAvatar(id);
      if (avatarPath)
        return res.sendFile(avatarPath, { root: 'avatars'});
      else
        throw new  NotFoundException;
    }
    return getAvatarFile();
  }

  @Public()
  @Get('achievements/:class')
  serveAchievImage(@Param('class') class_name: string, @Res() res) : Promise<any> {
    return res.sendFile(`${class_name}_icon.png`, { root: "src/achievements/images"});
  }

  // -------- // 
  //  DELETE  //
  // -------- // 

  // -> delete the user
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.usersService.remove(id);
  }

  // -> delete the user avatar picture
  @Delete(':id/avatar')
  async removeAvatar(@Param('id') id: number): Promise<void> {
    return await this.usersService.removeAvatar(id);
  }
}
