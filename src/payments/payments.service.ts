import { Injectable } from '@nestjs/common';

import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private client;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });
  }

  async createPreference(data: any) {
    const preference = new Preference(this.client);

    const response = await preference.create({
      body: {
        items: [
            {
                id: 'product-1',
                title: data.title,
                quantity: Number(data.quantity),
                unit_price: Number(data.price),
                currency_id: 'CLP',
            },
        ],
      },
    });

    return response;
  }
}
