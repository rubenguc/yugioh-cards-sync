import { Injectable, Logger } from '@nestjs/common';
import { InputJsonValue } from '@prisma/client/runtime/client';
import { PrismaService } from 'nestjs-prisma';
import { Card } from 'src/ygopro/ygopro.interface';

@Injectable()
export class CardService {
  private logger = new Logger(CardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async bulkInsert(cards: Card[]): Promise<void> {
    if (!cards || cards.length === 0) return;

    const formattedCards = cards.map((card) => ({
      id: card.id,
      name: card.name,
      typeline: card.typeline || [],
      type: card.type,
      humanReadableCardType: card.humanReadableCardType,
      frameType: card.frameType,
      desc: card.desc,
      race: card.race || null,
      atk: card.atk || null,
      def: card.def || null,
      level: card.level || null,
      attribute: card.attribute || null,
      archetype: card.archetype || null,
      ygoprodeck_url: card.ygoprodeck_url || null,
      card_images: (card.card_images || []) as unknown as InputJsonValue[],
      linkval: card.linkval || null,
      linkmarkers: card.linkmarkers || [],
    }));

    await this.prisma.card.createMany({
      data: formattedCards,
      skipDuplicates: true,
    });
  }
}
