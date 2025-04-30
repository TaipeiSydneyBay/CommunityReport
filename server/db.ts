import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { log } from './vite';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

log(`資料庫 URL: ${process.env.DATABASE_URL.substring(0, 20)}...`, "database");

// 建立連接池，設定更寬鬆的超時設定和重試邏輯
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 必須設為 false 以接受自簽證書
  },
  max: 20, // 最大連接數
  idleTimeoutMillis: 30000, // 30 秒空閒超時
  connectionTimeoutMillis: 10000, // 10 秒連接超時
});

// 測試連接
pool.connect()
  .then(client => {
    log("資料庫連接測試成功", "database");
    client.release();
  })
  .catch(err => {
    log(`資料庫連接測試失敗: ${err}`, "database");
  });

export const db = drizzle({ client: pool, schema });