import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {

  @ApiPropertyOptional({
    example: 'SKU-001',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    example: 'Taladro Bosch',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Bosch',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    example: 'Taladro inalámbrico profesional',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 89990,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: 'https://imagen.com/producto.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}