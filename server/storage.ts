import { users, reports, type User, type InsertUser, type Report, type InsertReport } from "@shared/schema";
import { db, pool } from "./db";
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
    try {
      // 直接使用 pool.query 來執行 SQL 查詢，而不是 db.execute
      const client = await pool.connect();
      
      try {
        // 將照片從 JSON 數組轉換為 PostgreSQL 數組格式
        const photosStr = `{${report.photos.map(p => `"${p}"`).join(',')}}`;
        
        const query = `
          INSERT INTO cr_reports 
          (building, location, report_type, description, contact, photos, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6::text[], DEFAULT) 
          RETURNING *
        `;
        
        const values = [
          report.building,
          report.location,
          report.reportType,
          report.description,
          report.contact,
          photosStr
        ];
        
        console.log("Executing query:", query);
        console.log("With values:", values);
        
        const result = await client.query(query, values);
        
        if (result.rows.length === 0) {
          throw new Error('No rows returned after insert');
        }
        
        // 轉換欄位名稱從 snake_case 到 camelCase
        const reportResult = {
          id: result.rows[0].id,
          building: result.rows[0].building,
          location: result.rows[0].location,
          reportType: result.rows[0].report_type,
          description: result.rows[0].description,
          contact: result.rows[0].contact,
          photos: result.rows[0].photos,
          createdAt: result.rows[0].created_at
        };
        
        return reportResult as Report;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
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
