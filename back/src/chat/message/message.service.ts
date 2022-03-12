import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @Inject(forwardRef(() => ChannelService))
        private readonly channelService: ChannelService
    ) {}

    async create(createMessageDto: CreateMessageDto, channelName: string) : Promise<Message> | null {
        if (await this.channelService.channelAlreadyExists(channelName) == false)
            return null;
        if (await this.channelService.userIsAuthorized(channelName, createMessageDto.owner)) {
            const message = new Message();
            message.channelName = channelName;
            message.owner = createMessageDto.owner;
            message.message = createMessageDto.message;
            // message.date = Date.now();
            message.dateStr = Date.now().toString();
            return await this.messageRepository.save(message);
        }
        
    }

    //////////////////////////////
    //  Gestion des messages    //
    //////////////////////////////

    async addMessageToHistories(message: Message) : Promise<void> {
        // const message = await this.messageRepository.findOne(msgId);
        await this.channelService.addMessageToHistory(message.channelName, message.id);
    }

    async remove(msgId: number): Promise<void> {
        await this.messageRepository.delete(msgId);
    }

    //////////////////////////////
    //  Recherche de messages   //
    //////////////////////////////

    async findOne(msgId: number): Promise<Message> {
        return await this.messageRepository.findOne(msgId);
    }
    async findAll(): Promise<Message[]> {
        return await this.messageRepository.find();
    }
    async findAllByUser(ownerId: number): Promise<Message[]> {
        return await this.messageRepository.find({ owner: ownerId });
    }
    async findAllInChannel(channelName: string): Promise<Message[]> {
        return await this.messageRepository.find({ channelName: channelName });
    }
}