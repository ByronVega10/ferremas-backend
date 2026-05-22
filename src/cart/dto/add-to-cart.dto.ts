import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {

  @ApiProperty({ 
    example: 1, 
    description: 'ID del usuario', 
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID del producto', 
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Cantidad de productos', 
  })
  @IsInt()
  @Min(1)
  quantity: number;
}