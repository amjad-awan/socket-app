import { Controller, Post, Body, BadRequestException, HttpStatus, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
@Controller("api/v1/user")
export class AppController {
  constructor(private readonly userService: UserService) {}
  @Post('/create-user')
  async signupUser(@Body() userData: Prisma.UserCreateInput): Promise<{ statusCode: number; message: string }> {
    try {
      const user = await this.userService.createUser(userData);
      return {statusCode: HttpStatus.CREATED, message: 'User successfully created' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  @Post('/login-user')
  async signInUser(@Body() userData: Prisma.UserCreateInput): Promise<{user:{name:string,email:string,id:number}, statusCode: number; message: string }> {
    try {
      const user = await this.userService.loginUser(userData);
      return {statusCode: HttpStatus.CREATED,user, message: 'User logged in  successfully created' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get("/get-users")
  async getAllUser():Promise<{ statusCode: number;users:User[], message: string}> {
    try {
      const users = await this.userService.getAllUser();
      return {statusCode: HttpStatus.CREATED,users, message: 'User logged in  successfully created' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  
}
