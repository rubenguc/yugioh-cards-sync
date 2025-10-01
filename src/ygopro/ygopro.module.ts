import { Module } from '@nestjs/common';
import { YgoproService } from './ygopro.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YgoproService],
  exports: [YgoproService],
})
export class YgoproModule {}
