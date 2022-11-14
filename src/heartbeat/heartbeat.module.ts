import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heartbeat } from './heartbeat.entity';
import { HeartbeatService } from './heartbeat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Heartbeat])],
  providers: [HeartbeatService],
  exports: [HeartbeatService],
})
export class HeartbeatModule {}
