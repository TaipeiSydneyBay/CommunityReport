import { users, reports, type User, type InsertUser, type Report, type InsertReport } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createReport(report: InsertReport): Promise<Report>;
  getReportById(id: number): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createReport(report: InsertReport): Promise<Report> {
    // 修正 photos 字段，從 JSON 字符串到 PostgreSQL 數組的轉換
    // 使用 raw SQL 查詢來避免數組格式問題
    const query = `
      INSERT INTO cr_reports (building, location, report_type, description, contact, photos, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, DEFAULT)
      RETURNING *
    `;

    // 將照片從 JSON 數組轉換為 PostgreSQL 數組格式
    const photosStr = `{${report.photos.map(p => `"${p}"`).join(',')}}`;

    const result = await db.execute(query, [
      report.building,
      report.location,
      report.reportType,
      report.description,
      report.contact,
      photosStr,
    ]);
    
    // 確保我們有結果
    if (result.length === 0) {
      throw new Error('Failed to create report');
    }
    
    return result[0] as unknown as Report;
  }

  async getReportById(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(reports.createdAt);
  }
}

export const storage = new DatabaseStorage();
