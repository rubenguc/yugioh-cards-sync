import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SyncHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  getSyncHistory() {
    return this.prisma.syncHistory.findFirst({
      orderBy: { id: 'desc' },
    });
  }

  createSyncHistory(data: any) {
    return this.prisma.syncHistory.create({
      data,
    });
  }
}
