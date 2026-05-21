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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener mis órdenes' })
  @Get('my-orders')
  findMyOrders(@Req() req) {
    return this.ordersService.findOrdersByUser(
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener detalles de mi orden' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.ordersService.findOne(
      Number(id),
      req.user.userId,
    );
  }
}
