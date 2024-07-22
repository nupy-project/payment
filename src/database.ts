import { Logger } from 'winston';
import { config } from '@payment/config';
import { Pool } from 'pg';
import { winstonLogger } from '@miges-libertad/library-shared';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'PaymentDatabaseServer', 'debug');

const pool: Pool = new Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: 5432,
  database: `${config.DATABASE_NAME}`
  // database: `${config.DATABASE_NAME}`,
  // ...(config.NODE_ENV !== 'development' && config.CLUSTER_TYPE === 'AWS' && {
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // })
});

pool.on('error', (error: Error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL UNIQUE,
    paymentId text NOT NULL,
    userId text NOT NULL,
    orderId text NOT NULL,
    amount numeric NOT NULL,
    currency text NOT NULL,
    paymentMethod text NOT NULL,
    paymentStatus text NOT NULL,
    transactionDate timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );
`;


const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    log.info('Payment service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('PaymentService - Unable to connecto to database');
    log.log('error', 'PaymentService () method error:', error);
  }
};

export { databaseConnection, pool };
