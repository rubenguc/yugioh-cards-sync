import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { YgoproService } from './ygopro/ygopro.service';
import { SyncHistoryService } from './sync-history/sync-history.service';
import { CardParams } from './ygopro/ygopro.interface';
import { CardService } from './card/card.service';
import { TypesenseService } from './typesense/typesense.service';

@Injectable()
export class AppService implements OnModuleInit {
  private logger = new Logger('AppService');

  constructor(
    private readonly typeService: TypesenseService,
    private readonly syncHistoryService: SyncHistoryService,
    private readonly ygoproService: YgoproService,
    private readonly cardService: CardService,
  ) {}

  async onModuleInit() {
    await this.syncDatabase();
  }

  async syncDatabase() {
    try {
      const { shouldSync, last_card_id, database_version, last_update } =
        await this.getSyncInfo();

      if (!shouldSync) return this.logger.log('Nothing to sync');

      const isFirstSync = !last_card_id;

      const params = !isFirstSync
        ? ({ num: '100', offset: '0' } as CardParams)
        : undefined;

      this.logger.log('syncing cards');
      const cards = await this.ygoproService.getCards(params);

      this.logger.debug(`Syncing ${cards.length} cards`);

      const newLastCardId = cards[0].id;

      await this.cardService.bulkInsert(cards);

      await this.typeService.bulkInsert(cards);

      await this.syncHistoryService.createSyncHistory({
        database_version,
        last_update,
        last_card_id: newLastCardId,
      });
      this.logger.log('Sync completed');
    } catch (error) {
      this.logger.error('Error syncing database', error);
    }
  }

  async getSyncInfo(): Promise<{
    shouldSync: boolean;
    last_card_id: number;
    database_version: string;
    last_update: string;
  }> {
    const [dbVer, syncHistory] = await Promise.all([
      this.ygoproService.getDBVer(),
      this.syncHistoryService.getSyncHistory(),
    ]);

    this.logger.debug(JSON.stringify({ dbVer, syncHistory }, null, 2));

    const shouldSync =
      !syncHistory?.database_version ||
      dbVer.database_version > syncHistory?.database_version;

    return {
      shouldSync,
      last_card_id: syncHistory?.last_card_id || 0,
      database_version: dbVer?.database_version || '',
      last_update: dbVer?.last_update || '',
    };
  }
}
