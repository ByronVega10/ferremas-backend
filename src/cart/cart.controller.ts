import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ 
    summary: 'Agregar producto al carrito', 
    description: 'Agrega un producto al carrito de compras de un usuario.', 
  }) 
  @ApiResponse({ 
    status: 201, 
    description: 'Producto agregado correctamente', 
  })
  @Post('add')
  addToCart(@Body() data: AddToCartDto) {
    return this.cartService.addToCart(data);
  }

  @ApiOperation({ 
    summary: 'Obtener carrito del usuario', 
    description: 'Retorna todos los productos agregados al carrito.', 
  }) 
  @ApiParam({ 
    name: 'userId', 
    example: 1, 
    description: 'ID del usuario', 
  }) 
  @ApiResponse({ 
    status: 200, 
    description: 'Carrito obtenido correctamente', 
  })
  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(Number(userId));
  }

  @ApiOperation({ 
    summary: 'Actualizar cantidad de producto', 
    description: 'Actualiza la cantidad de un producto dentro del carrito.', 
  }) 
  @ApiParam({ 
    name: 'itemId', 
    example: 1, 
    description: 'ID del item del carrito', 
  }) 
  @ApiResponse({ 
    status: 200, 
    description: 'Cantidad actualizada correctamente', 
  })
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

  @ApiOperation({ 
    summary: 'Eliminar producto del carrito', 
    description: 'Elimina un producto específico del carrito.', 
  }) 
  @ApiParam({ 
    name: 'itemId', 
    example: 1, 
    description: 'ID del item del carrito', 
  }) 
  @ApiResponse({ 
    status: 200, 
    description: 'Producto eliminado correctamente', 
  })
  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(Number(itemId));
  }
}
