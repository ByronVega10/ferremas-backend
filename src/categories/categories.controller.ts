import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({
    summary: 'Crear nueva categoría',
    description: 'Solo administradores pueden crear categorías',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCreatedResponse({
    description: 'Categoría creada correctamente',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)  
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoriesService.create(data);
  }


  @ApiOperation({
    summary: 'Obtener todas las categorías',
  })
  @ApiOkResponse({
    description: 'Lista categorías obtenida correctamente',
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  
  @ApiOperation({
    summary: 'Obtener una categoria por ID',
  })
  @ApiOkResponse({
    description: 'Categoría obtenida correctamente',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(Number(id));
  }


  @ApiOperation({
    summary: 'Eliminar una categoria por ID',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Categoría eliminada correctamente',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(Number(id));
  }
}