import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Realizar checkout' })
  @Post('checkout')
  checkout(@Req() req) {
    return this.ordersService.checkout(req.user.userId);
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
