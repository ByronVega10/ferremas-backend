import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @ApiOperation({ summary: 'Crear pago desde una orden' })
  @ApiResponse({ status: 201, description: 'Pago creado correctamente' })
  @Post('create')
  createPayment(@Body() body: CreatePaymentDto) {
    return this.paymentsService.createPayment(body.orderId);
  }

  @Post('webhook')
  webhook(@Body() body: any) {
    const paymentId = body?.data?.id;

    if (!paymentId) {
      return { received: true };
    }

    return this.paymentsService.handleWebhook(paymentId);
  }
}