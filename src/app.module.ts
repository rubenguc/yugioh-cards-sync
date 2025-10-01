import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from 'nestjs-prisma';
import { TypesenseModule } from './typesense/typesense.module';
import { SyncHistoryModule } from './sync-history/sync-history.module';
import { YgoproModule } from './ygopro/ygopro.module';
import { CardModule } from './card/card.module';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    TypesenseModule,
    SyncHistoryModule,
    YgoproModule,
    CardModule,
  ],
  providers: [AppService],
})
export class AppModule {}
