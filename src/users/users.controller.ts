import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';


@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )

  @Roles('ADMIN') 
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios', 
    description: 'Retorna la lista completa de usuarios registrados. Solo administradores.', 
  }) 
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios obtenidos correctamente', 
  }) 
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado', 
  }) 
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado', 
  }) 
  @Get() 
  findAll() { 
    return this.usersService.findAll(); 
  }
}
