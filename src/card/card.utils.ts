import { InputJsonValue } from '@prisma/client/runtime/library';
import { Card } from 'src/ygopro/ygopro.interface';

export function formatCards(cards: Card[]) {
  return cards.map((card) => ({
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
}

export function formatForSearch(cards: Card[]) {
  return cards.map((card) => ({
    id: String(card.id),
    name: card.name,
    typeline: card.typeline || [],
    type: card.type,
    humanReadableCardType: card.humanReadableCardType,
    frameType: card.frameType,
    desc: card.desc,
    race: card.race || '',
    atk: card.atk || -1,
    def: card.def || -1,
    level: card.level || -1,
    attribute: card.attribute || '',
    archetype: card.archetype || '',
    ygoprodeck_url: card.ygoprodeck_url || '',
    card_images: (card.card_images || []) as unknown as InputJsonValue[],
    linkval: card.linkval || -1,
    linkmarkers: card.linkmarkers || [],
  }));
}
