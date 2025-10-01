import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { formatForSearch } from 'src/card/card.utils';
import { envs } from 'src/config/env';
import { Card } from 'src/ygopro/ygopro.interface';
import Typesense, { Client } from 'typesense';

@Injectable()
export class TypesenseService implements OnModuleInit {
  private logger = new Logger(TypesenseService.name);

  private client: Client;
  private readonly collectionName = 'cards';

  constructor() {
    this.client = new Typesense.Client({
      nodes: [
        {
          host: envs.typesenseHost,
          port: envs.typesensePort,
          protocol: envs.typesenseProtocol,
        },
      ],
      apiKey: envs.typesenseApiKey,
      connectionTimeoutSeconds: 2,
    });
  }

  async onModuleInit() {
    await this.createCollectionIfNotExists();
  }

  private async createCollectionIfNotExists() {
    try {
      await this.client.collections(this.collectionName).retrieve();
      this.logger.log('Colección de Typesense ya existe.');
    } catch (_error) {
      // La colección no existe, créala
      await this.client.collections().create({
        name: this.collectionName,
        enable_nested_fields: true,
        fields: [
          { name: 'id', type: 'string', facet: false },
          { name: 'name', type: 'string', facet: false },
          { name: 'typeline', type: 'string[]', facet: true },
          { name: 'type', type: 'string', facet: true },
          { name: 'humanReadableCardType', type: 'string', facet: true },
          { name: 'frameType', type: 'string', facet: true },
          { name: 'desc', type: 'string', facet: false },
          { name: 'race', type: 'string', facet: true },
          { name: 'atk', type: 'int32', facet: true },
          { name: 'def', type: 'int32', facet: true },
          { name: 'level', type: 'int32', facet: true },
          { name: 'attribute', type: 'string', facet: true },
          { name: 'archetype', type: 'string', facet: true },
          { name: 'ygoprodeck_url', type: 'string', facet: false },
          { name: 'card_images', type: 'object[]', facet: false },
          { name: 'linkval', type: 'int32', facet: true },
          { name: 'linkmarkers', type: 'string[]', facet: true },
        ],
      });
      this.logger.log('Colección de Typesense creada.');
    }
  }

  async bulkInsert(cards: Card[]) {
    const data = formatForSearch(cards);

    await this.client
      .collections(this.collectionName)
      .documents()
      .import(data, { action: 'upsert' });
  }

  getClient(): Client {
    return this.client;
  }

  getCollectionName(): string {
    return this.collectionName;
  }
}
