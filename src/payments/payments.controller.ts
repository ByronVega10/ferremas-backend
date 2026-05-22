import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear pago desde una orden' })
  @ApiResponse({ status: 201, description: 'Pago creado correctamente' })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @Post('create')
  createPayment(@Body() body: CreatePaymentDto) {
    return this.paymentsService.createPayment(body.orderId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Manejar webhook de pago' })
  @ApiResponse({ status: 200, description: 'Webhook procesado correctamente' })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @Post('webhook')
  webhook(@Body() body: any) {
    const paymentId = body?.data?.id;

    if (!paymentId) {
      return { received: true };
    }

    return this.paymentsService.handleWebhook(paymentId);
  }
}