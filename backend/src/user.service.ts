import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!data.email || !data.password) {
      throw new BadRequestException('Email or password is missing');
    }

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(data.password,saltOrRounds)

    return this.prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashPassword, // Store hashed password in database
            // Add any other fields from data that you want to store
          },
    });
  }



  async loginUser(data: { email: string; password: string }): Promise<{ id: number; email: string; name: string }> {
    // Check if the user already exists
    if (!data.email || !data.password) {
        throw new BadRequestException('Email or password is missing');
      }
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    const passMatched = await bcrypt.compare(data.password, existingUser.password)
    if (!passMatched) {
        throw new BadRequestException('password does not matched');
      }
    if (!existingUser) {
      throw new BadRequestException('User does not exists');
    }
    return { id: existingUser.id, email: existingUser.email, name: existingUser.name };
  }
  async getAllUser(): Promise<User[]> {
  
    const users = await this.prisma.user.findMany();
   
    return users;
  }
}
