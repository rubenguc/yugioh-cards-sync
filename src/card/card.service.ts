import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Card } from 'src/ygopro/ygopro.interface';
import { formatCards } from './card.utils';

@Injectable()
export class CardService {
  private logger = new Logger(CardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async bulkInsert(cards: Card[]): Promise<void> {
    if (!cards || cards.length === 0) return;

    const data = formatCards(cards);

    await this.prisma.card.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
