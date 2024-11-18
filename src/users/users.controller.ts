import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { LoginDTO } from './dto/login-users.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    return this.usersService.create(createUserDto, request);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    return this.usersService.update(id, updateUserDto, request);
  }

  @Patch('password/:id')
  updatePassword(@Param('id', ParseUUIDPipe) id: string, @Body() updatePassword: UpdatePasswordDTO, @Req() request: Request) {
    return this.usersService.updatePasswordUser(id, updatePassword, request);
  }

  @Post('login')
  login(@Body() loginUserDTO: LoginDTO, @Req() request: Request) {
    return this.usersService.login(loginUserDTO, request);
  }

}
