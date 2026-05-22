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
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description: 'Solo administradores pueden crear productos',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiCreatedResponse({
    description: 'Producto creado correctamente',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o ausente',
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }


  @ApiOperation({
    summary: 'Obtener todos los productos',
    description: 'Retorna lista completa de productos',
  })
  @ApiOkResponse({
    description: 'Lista de productos obtenida correctamente',
  })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }


  @ApiOperation({
    summary: 'Obtener productos por categoría',
    description: 'Retorna lista de productos filtrados por categoría',
  })
  @ApiOkResponse({
    description: 'Lista de productos obtenida correctamente',
  })
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.productsService.findByCategory(Number(id));
  }


  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Retorna los detalles de un producto específico',
  })
  @ApiOkResponse({
    description: 'Producto obtenido correctamente',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Actualizar producto',
    description: 'Permite editar un producto existente',
  })
  @ApiOkResponse({
    description: 'Producto actualizado correctamente',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.update(
      Number(id),
      data,
    );
  }


  @ApiOperation({
    summary: 'Eliminar un producto por ID',
    description: 'Solo administradores pueden eliminar productos',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Producto eliminado correctamente',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}