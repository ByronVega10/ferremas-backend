import { Body, Controller, Post } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('create-preference')
  createPreference(@Body() data: CreatePaymentDto) {
    return this.paymentsService.createPreference(data);
  }
}
