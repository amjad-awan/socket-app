import { Controller, Post, Body, BadRequestException, HttpStatus, Get } from '@nestjs/common';
import { messagesService } from './chat.service';
import { Message } from '@prisma/client';
@Controller("api/v1/message")
export class ChatController {
  constructor(private readonly messageService: messagesService) {}
  @Get('/get-messages')
  async getMessages(): Promise<{ statusCode: number;messages:Message[], message: string }> {
    try {
      const messages = await this.messageService.getMessages();
      return {statusCode: HttpStatus.CREATED,messages:messages, message: 'all messages' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
      
    }
  }
}
