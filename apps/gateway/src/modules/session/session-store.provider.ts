import pgSessionFactory from 'connect-pg-simple';
import session from 'express-session';
import { Pool } from 'pg';

export const SESSION_STORE = 'SESSION_STORE';

export const sessionStoreProvider = {
  provide: SESSION_STORE,
  useFactory: () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const PgStore = pgSessionFactory(session);
    return new PgStore({ pool, tableName: 'Session' });
  },
};
