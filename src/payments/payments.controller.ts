import { Body, Controller, Post } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @ApiOperation({ summary: 'Crear preferencia de pago Mercado Pago' })
  @ApiResponse({ status: 201, description: 'Preferencia creada correctamente' })
  @Post('create-preference')
  createPreference(@Body() data: CreatePaymentDto) {
    return this.paymentsService.createPreference(data);
  }
}
