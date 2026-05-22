import {
  IsArray,
  IsInt,
  ValidateNested,
} from 'class-validator';

import {
  ApiProperty,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

class OrderItemDto {

  @ApiProperty({
    example: 1,
    description: 'ID producto',
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Cantidad',
  })
  @IsInt()
  quantity: number;
}

export class CreateOrderDto {

  @ApiProperty({
    example: 1,
    description: 'ID usuario',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}