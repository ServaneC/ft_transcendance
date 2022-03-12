import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "src/auth/utils/public.decorator";
import { MatchService } from "./match.service";
import { PostMatchDto } from './dto/post-match.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from "./match.entity";

@Controller('game')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    // fonction temporaire pour faire des tests
    @Post()
    @Public()
    async createMatch(@Body() createMatchDto: CreateMatchDto) {
        const match = await this.matchService.create(createMatchDto.playerOne, createMatchDto.playerTwo);
        return match;
    }

    // fonction temporaire pour faire des tests
    @Post(':id')
    @Public()
    async endMatch(@Param('id') matchId: string, @Body() postMatchDto: PostMatchDto) {
        console.log("endMatch");
        const match = await this.matchService.findOne(matchId);
        await this.matchService.simulateMatch(matchId, postMatchDto.scorePlayerOne, postMatchDto.scorePlayerTwo);
        await this.matchService.updateUsersAfterGame(matchId);
    }

    @Get()
    @Public()
    async findAllMatches() {
        return await this.matchService.findAll();
    }

    @Get(':id')
    @Public()
    async findOne(@Param('id') matchId: string) {
        return await this.matchService.findOne(matchId);
    }

    @Get('user/:id')
    @Public()
    async findAllWithUser(@Param('id') userId: number) {
        return await this.matchService.findAllWithUser(userId);
    }

}