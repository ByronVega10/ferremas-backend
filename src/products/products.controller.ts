import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener productos por categoría' })
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.productsService.findByCategory(Number(id));
  }

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }
}