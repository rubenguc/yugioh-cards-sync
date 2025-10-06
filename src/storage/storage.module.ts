import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
