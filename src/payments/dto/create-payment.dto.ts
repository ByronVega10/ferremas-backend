import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {

  @ApiProperty({
    example: 1,
    description: 'ID de la orden a pagar',
  })
  @IsNumber()
  orderId: number;

}