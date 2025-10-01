import { Module } from '@nestjs/common';
import { SyncHistoryService } from './sync-history.service';
import { SyncHistoryController } from './sync-history.controller';

@Module({
  providers: [SyncHistoryService],
  controllers: [SyncHistoryController],
  exports: [SyncHistoryService],
})
export class SyncHistoryModule {}
