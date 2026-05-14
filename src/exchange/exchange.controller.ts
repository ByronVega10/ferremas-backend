import { Controller, Get } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import {
  ApiOperation, ApiResponse, ApiTags,} from '@nestjs/swagger';

@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(
    private readonly exchangeService: ExchangeService,
  ) {}

  @ApiOperation({summary: 'Obtener valor dólar en tiempo real',})
  @ApiResponse({status: 200, description: 'Valor USD obtenido correctamente',})
  @Get('usd')
  getDollarValue() {
    return this.exchangeService.getDollarValue();
  }

  @ApiOperation({summary: 'Obtener valor euro en tiempo real',})
  @ApiResponse({status: 200, description: 'Valor EUR obtenido correctamente',})
  @Get('euro')
  getEuroValue() {
    return this.exchangeService.getEuroValue();
  }
}