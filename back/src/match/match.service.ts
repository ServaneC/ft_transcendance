import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity'
import { UsersService } from 'src/users/users.service';
import { enumAchievements } from 'src/achievements/achievements';


@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    async create(userOneId: number, userTwoId: number) : Promise<Match> {
        const match = new Match();
        match.playerOne = userOneId;
        match.playerTwo = userTwoId;
        match.scorePlayerOne = 0; 
        match.scorePlayerTwo = 0;
        return await this.matchRepository.save(match);
    }

    async findAll() : Promise<Match[]> {
        return await this.matchRepository.find();
    }

    async countVictoriesLosses(userId: number, matches: Match[]) {
        let victories: number = 0;
        let losses: number  = 0;
        for (let i = 0; i < matches.length; i++) {
          if ((matches[i].scorePlayerOne > matches[i].scorePlayerTwo && matches[i].playerOne == userId) ||
                matches[i].scorePlayerTwo > matches[i].scorePlayerOne && matches[i].playerTwo == userId) {
             victories += 1;
          }
          else {
            losses += 1;
          }
        }
        return {
            victories: victories,
            losses: losses,
        }
    }

    async findAllWithUser(userId: number) : Promise<any> {
        const matches = await this.matchRepository.find({
            where: [
                { playerOne: userId }, 
                { playerTwo: userId },
            ]
        });
        matches.sort((a: Match, b: Match) => (a.matchId > b.matchId ? -1 : 1));
        const vicandlos = await this.countVictoriesLosses(userId, matches);
        const players = await this.usersService.findAllPlayersMatchHistory(userId, matches);
        return {
            matches: matches,
            players: players,
            victories: vicandlos.victories,
            losses: vicandlos.losses,
        };
    }
    async findOne(matchId: string): Promise<Match> {
        return await this.matchRepository.findOne(matchId);
    }

    // fonction temporaire pour faire des tests
    async simulateMatch(matchId: string, playerOneScore: number, playerTwoScore: number) : Promise<void> {
        const match = await this.matchRepository.findOne(matchId);
        match.scorePlayerOne = playerOneScore;
        match.scorePlayerTwo = playerTwoScore;
        await this.matchRepository.save(match);
    }

    // testée et approuvée !!
    async updateUsersAfterGame(matchId: string): Promise<void> {
        const match = await this.matchRepository.findOne(matchId);
        let winnerId = match.playerOne;
        let loserId = match.playerTwo;
        if (match.scorePlayerOne < match.scorePlayerTwo)
        {
            const tmp = loserId;
            loserId = winnerId;
            winnerId = tmp;
        }
        try {
            await this.usersService.setAchievementAsync(winnerId, enumAchievements.WIN_ONE_GAME)
            await this.usersService.setAchievementAsync(loserId, enumAchievements.LOSE_ONE_GAME)
            await this.usersService.updateLadderLevel(winnerId, loserId);
        } catch(err) {
            console.log(err);
        }
    }
}