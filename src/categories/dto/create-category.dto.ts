import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

  @ApiProperty({
    example: 'Herramientas Eléctricas',
    description: 'Nombre categoría',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({
    example: 'Taladros, sierras y herramientas eléctricas',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}