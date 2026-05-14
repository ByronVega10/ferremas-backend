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

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() data: AddToCartDto) {
    return this.cartService.addToCart(data);
  }

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(Number(userId));
  }

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

  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(Number(itemId));
  }
}
