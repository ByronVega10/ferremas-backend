import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    
  @ApiProperty({
    example: 'SKU-001',
    description: 'Código único del producto',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 'Taladro Bosch',
    description: 'Nombre del producto',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Bosch',
    description: 'Marca del producto',
  })
  @IsString()
  brand: string;

  @ApiProperty({
    example: 'Taladro percutor inalámbrico',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 89990,
    description: 'Precio del producto',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 15,
    description: 'Cantidad en stock',
  })
  @IsInt()
  stock: number;

  @ApiProperty({
    example: 'https://imagen.com/producto.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    example: 1,
    description: 'ID de categoría',
  })
  @IsInt()
  categoryId: number;
}