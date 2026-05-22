import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Realizar checkout',
    description: 'Genera una nueva orden desde el carrito',
  })
  @ApiOkResponse({
    description: 'Orden creada correctamente',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
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
  @ApiBearerAuth('JWT-auth')
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
