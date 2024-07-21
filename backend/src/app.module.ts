import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [ChatsModule],
  controllers: [AppController],
  providers: [UserService,PrismaService],
})
export class AppModule {}
