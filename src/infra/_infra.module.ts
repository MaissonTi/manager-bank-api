import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/_database.module';

@Module({
  imports: [DatabaseModule],
  providers: [],
  exports: [DatabaseModule],
})
export class InfraModule {}
