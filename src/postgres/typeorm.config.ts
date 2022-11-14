// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: ['dist/**/*.entity{.ts,.js}'],
    schema: 'public',
    logging: false,
    synchronize: false,
    autoLoadEntities: true,
    migrations: ['src/postgres/migrations/*{.ts,.js}'],
  };
};

export default getConfig();

/*
docker kill $(docker ps -q)
docker image rm -f $(docker images -a -q)
docker rm -f $(docker ps -a -q)
docker container prune -f
docker image prune -f
docker volume rm -f $(docker volume ls -q)
*/
