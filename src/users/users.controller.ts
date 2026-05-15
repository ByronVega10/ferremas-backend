import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @Roles('ADMIN')
  findAll() {

    return this.usersService.findAll();
  }
}
