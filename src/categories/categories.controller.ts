import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';

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


  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Editar categoría',
    description: 'Permite actualizar datos de una categoría',
  })
  @ApiOkResponse({
    description: 'Categoría actualizada correctamente',
  })
  @ApiNotFoundResponse({
    description: 'Categoría no encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(
      Number(id),
      data,
    );
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