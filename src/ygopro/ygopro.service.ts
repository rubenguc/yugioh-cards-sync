import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  Card,
  CardInfoResponse,
  CardParams,
  DBVersion,
} from './ygopro.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YgoproService {
  private BASE_URL = 'https://db.ygoprodeck.com/api/v7';

  constructor(private readonly httpService: HttpService) {}

  async getDBVer(): Promise<DBVersion> {
    const response = await firstValueFrom(
      this.httpService.get<DBVersion[]>(`${this.BASE_URL}/checkDBVer.php`),
    );

    return response.data[0];
  }

  async getCards(params?: CardParams): Promise<Card[]> {
    const response = await firstValueFrom(
      this.httpService.get<CardInfoResponse>(`${this.BASE_URL}/cardinfo.php`, {
        params: {
          ...params,
          sort: 'new',
          misc: 'yes',
        },
      }),
    );

    return response.data.data;
  }
}
