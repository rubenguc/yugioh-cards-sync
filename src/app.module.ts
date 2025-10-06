import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from 'nestjs-prisma';
import { TypesenseModule } from './typesense/typesense.module';
import { SyncHistoryModule } from './sync-history/sync-history.module';
import { YgoproModule } from './ygopro/ygopro.module';
import { CardModule } from './card/card.module';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { StorageModule } from './storage/storage.module';

@Module({
  controllers: [AppController],
  imports: [
    LoggerModule.forRoot(),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    TypesenseModule,
    SyncHistoryModule,
    YgoproModule,
    CardModule,
    StorageModule,
  ],
  providers: [AppService],
})
export class AppModule {}
