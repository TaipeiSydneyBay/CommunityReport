import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { reports, users } from "@shared/schema";
import { sql } from "drizzle-orm";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // 創建必要的資料表
  try {
    log("嘗試建立資料表...", "database");
    
    // 直接使用 pool 來執行 SQL 查詢
    const client = await pool.connect();
    
    try {
      // 建立 users 表
      await client.query(`
        CREATE TABLE IF NOT EXISTS cr_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          password TEXT NOT NULL
        )
      `);
      
      // 建立 reports 表
      await client.query(`
        CREATE TABLE IF NOT EXISTS cr_reports (
          id SERIAL PRIMARY KEY,
          building TEXT NOT NULL,
          location TEXT NOT NULL,
          report_type TEXT NOT NULL,
          description TEXT NOT NULL,
          contact TEXT NOT NULL,
          photos TEXT[] NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      log("資料表已成功建立或已存在", "database");
    } catch (err) {
      log(`執行 SQL 查詢時出錯: ${err}`, "database");
    } finally {
      client.release();
    }
  } catch (error) {
    log(`建立資料表時出錯: ${error}`, "database");
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = +process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
