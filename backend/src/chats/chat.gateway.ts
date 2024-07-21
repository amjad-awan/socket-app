import { Injectable, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma.service";
import { Message } from '@prisma/client';

@Injectable()
@WebSocketGateway({
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(EventsGateway.name);
    
    @WebSocketServer()
    io: Server;

    constructor(private readonly prisma: PrismaService) {}

    private unreadCounts: { [key: string]: { [key: string]: number } } = {};

    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: Socket) {
        console.log(`Client id: ${client.id} connected`);
        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${this.io.engine.clientsCount}`);

        client.on('join', (userId: number) => {
            client.join(userId.toString());
            this.logger.log(`Client ${client.id} joined room ${userId}`);
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client id: ${client.id} disconnected`);
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() message: Message, @ConnectedSocket() client: Socket): Promise<void> {
        console.log('message', message);
    
        // Save message to database
        const savedMessage = await this.prisma.message.create({
            data: {
                senderId: message.senderId,
                recieverId: message.recieverId,
                text: message.text,
                senderName: message.senderName, // Fetch or set the actual sender's name
                recieverName: message.recieverName, // Fetch or set the actual receiver's name
            },
        });
    
        console.log('savedMessage', savedMessage);
    
        // Update or create unread message count
        await this.prisma.unreadMessage.upsert({
            where: {
                senderId_recieverId: {
                    senderId: message.senderId,
                    recieverId: message.recieverId,
                },
            },
            update: {
                count: {
                    increment: 1,
                },
            },
            create: {
                senderId: message.senderId,
                recieverId: message.recieverId,
                count: 1,
            },
        });
    
        // Emit the message only to the sender and receiver
        this.io.to(message.senderId.toString()).emit('message', savedMessage);
        this.io.to(message.recieverId.toString()).emit('message', savedMessage);
        // Update unread counts for the specific sender
        if (!this.unreadCounts[message.recieverId]) {
            this.unreadCounts[message.recieverId] = {};
        }
        if (!this.unreadCounts[message.recieverId][message.senderId]) {
            this.unreadCounts[message.recieverId][message.senderId] = 0;
        }
        this.unreadCounts[message.recieverId][message.senderId]++;
        this.io.to(message.recieverId.toString()).emit('update-unread-count', this.unreadCounts[message.recieverId]);
    }
    
    @SubscribeMessage('get-unread-counts')
    async handleGetUnreadCounts(@MessageBody() userId: number, @ConnectedSocket() client: Socket): Promise<void> {
        const unreadCounts = await this.prisma.unreadMessage.findMany({
            where: {
                recieverId: userId,
            },
        });
    
        const countsMap = unreadCounts.reduce((acc, count) => {
            acc[count.senderId] = count.count;
            return acc;
        }, {});
        client.emit('unread-counts', countsMap);
    }
    
    @SubscribeMessage('mark-as-read')
    async handleMarkAsRead(@MessageBody() data: { senderId: number, recieverId: number }, @ConnectedSocket() client: Socket): Promise<void> {
        const { senderId, recieverId } = data;

        await this.prisma.unreadMessage.deleteMany({
            where: {
                senderId: senderId,
                recieverId: recieverId,
            },
        });

        // Update the in-memory count
        if (this.unreadCounts[recieverId]) {
            this.unreadCounts[recieverId][senderId] = 0;
            this.io.to(recieverId.toString()).emit('update-unread-count', this.unreadCounts[recieverId]);
        }

        client.emit('mark-as-read', { success: true });
    }
}
