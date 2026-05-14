import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @Post('add')
  addToCart(@Body() data: AddToCartDto) {
    return this.cartService.addToCart(data);
  }

  @ApiOperation({ summary: 'Obtener el carrito de un usuario' })
  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(Number(userId));
  }

  @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito' })
  @Patch(':itemId')
  updateQuantity(
    @Param('itemId') itemId: string,
    @Body() data: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(
      Number(itemId),
      data.quantity,
    );
  }

  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(Number(itemId));
  }
}
