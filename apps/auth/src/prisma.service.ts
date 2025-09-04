import { PrismaClient } from '.prisma/client';  // Auto generated types for our database
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Run prisma client on module initialization to connect to the DB
  async onModuleInit() {
    await this.$connect();
  }
}
