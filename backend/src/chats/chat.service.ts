import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../prisma.service";

@Injectable()
export class messagesService {
  constructor(private prisma: PrismaService) {}
  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany();
  }


 
}
