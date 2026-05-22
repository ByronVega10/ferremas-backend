import {
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {

  @ApiPropertyOptional({
    example: 'Herramientas Eléctricas',
    description: 'Nuevo nombre de la categoría',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Taladros, sierras y herramientas eléctricas',
    description: 'Nueva descripción',
  })
  @IsOptional()
  @IsString()
  description?: string;
}