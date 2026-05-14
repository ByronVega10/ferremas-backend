import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOperation({ summary: 'Realizar checkout' })
  @Post('checkout')
  checkout(@Body() data: CreateOrderDto) {
    return this.ordersService.checkout(data.userId);
  }

  @ApiOperation({ summary: 'Obtener órdenes por usuario' })
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findOrdersByUser(
      Number(userId),
    );
  }

  @ApiOperation({ summary: 'Obtener detalles de una orden' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }
}
