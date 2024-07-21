import { Module } from '@nestjs/common';
import { EventsGateway } from './chat.gateway';
import { PrismaService } from "../prisma.service";
import { ChatController } from './chat.controller';
import { messagesService } from './chat.service';


@Module({
    imports: [],
    controllers: [ChatController],
    providers: [EventsGateway,PrismaService,messagesService],
})
export class ChatsModule {}
