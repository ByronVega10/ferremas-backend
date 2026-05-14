import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExchangeService {
  constructor(private httpService: HttpService) {}

  async getDollarValue() {
    const response = await firstValueFrom(
      this.httpService.get('https://mindicador.cl/api/dolar'),
    );

    return {
      currency: 'USD',
      value: response.data.serie[0].valor,
      date: response.data.serie[0].fecha,
    };
  }

  async getEuroValue() {
    const response = await firstValueFrom(
      this.httpService.get('https://mindicador.cl/api/euro'),
    );

    return {
      currency: 'EUR',
      value: response.data.serie[0].valor,
      date: response.data.serie[0].fecha,
    };
  }
}
