import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import typeormConfig from '../postgres/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from '../group/group.module';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import { Heartbeat } from '../heartbeat/heartbeat.entity';

@Module({
  imports: [
    GroupModule,
    HeartbeatModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [registerAs('postgres', (): TypeOrmModule => typeormConfig)],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'postgres'>('postgres.type'),
        host: configService.get<string>('postgres.host'),
        port: configService.get<number>('postgres.port'),
        database: configService.get<string>('postgres.database'),
        username: configService.get<string>('postgres.username'),
        password: configService.get<string>('postgres.password'),
        entities: configService.get<string[]>('postgres.entities'),
        logging: configService.get<boolean>('postgres.logging'),
        synchronize: configService.get<boolean>('postgres.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'postgres.autoLoadEntitites',
        ),
        ssl: configService.get<boolean>('postgres.ssl'),
        extra: configService.get<boolean>('postgres.extra'),
      }),
    }),
    TypeOrmModule.forFeature([Heartbeat]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
