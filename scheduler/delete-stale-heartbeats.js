/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('pg');
require('dotenv').config();
const cron = require('node-cron');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

client.connect();

const job = async () => {
  const response = await client.query(
    `delete from "heartbeat" where last_updated_at < now()-'${
      process.env.MS_STALE_OFFER / 1000
    } seconds'::interval`,
  );

  console.log(`deleted ${response.rowCount} stale heartbeats`);
};

cron.schedule(process.env.CRON_EXPRESSION, job);
