import { users, reports, comments, type User, type InsertUser, type Report, type InsertReport, type UpdateReport, type InsertComment, type Comment } from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

// 表示位置報告狀態的介面
export interface LocationStatus {
  building: string;
  location: string;
  reportCount: number;
  latestReportDate: string | null;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createReport(report: InsertReport): Promise<Report>;
  getReportById(id: number): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  getLocationReportStatus(): Promise<LocationStatus[]>;
  updateReportStatus(id: number, updateData: UpdateReport): Promise<Report | undefined>;
  addComment(comment: InsertComment): Promise<Comment>;
  getReportComments(reportId: number): Promise<Comment[]>;
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
  
  async updateReportStatus(id: number, updateData: UpdateReport): Promise<Report | undefined> {
    try {
      const client = await pool.connect();
      
      try {
        // 組建更新SQL語句
        let query = "UPDATE cr_reports SET status = $1::report_status, updated_at = CURRENT_TIMESTAMP";
        const values = [updateData.status as "pending" | "processing" | "completed" | "rejected"];
        
        // 如果有改善文字，則添加到更新中
        if (updateData.improvementText !== undefined) {
          query += ", improvement_text = $2";
          values.push(updateData.improvementText as string);
        }
        
        // 添加WHERE條件和RETURNING子句
        query += " WHERE id = $" + (values.length + 1) + " RETURNING *";
        values.push(id as any);
        
        console.log("Executing update query:", query);
        console.log("With values:", values);
        
        const result = await client.query(query, values);
        
        if (result.rows.length === 0) {
          return undefined;
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
          createdAt: result.rows[0].created_at,
          status: result.rows[0].status,
          improvementText: result.rows[0].improvement_text,
          updatedAt: result.rows[0].updated_at
        };
        
        return reportResult as Report;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  }
  
  async addComment(comment: InsertComment): Promise<Comment> {
    try {
      const client = await pool.connect();
      
      try {
        const query = `
          INSERT INTO cr_comments 
          (report_id, content, created_by) 
          VALUES ($1, $2, $3) 
          RETURNING *
        `;
        
        const values = [
          comment.reportId,
          comment.content,
          comment.createdBy
        ];
        
        console.log("Executing comment insert query:", query);
        console.log("With values:", values);
        
        const result = await client.query(query, values);
        
        if (result.rows.length === 0) {
          throw new Error('No rows returned after comment insert');
        }
        
        // 轉換欄位名稱從 snake_case 到 camelCase
        const commentResult = {
          id: result.rows[0].id,
          reportId: result.rows[0].report_id,
          content: result.rows[0].content,
          createdBy: result.rows[0].created_by,
          createdAt: result.rows[0].created_at
        };
        
        return commentResult as Comment;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
  
  async getReportComments(reportId: number): Promise<Comment[]> {
    try {
      const client = await pool.connect();
      
      try {
        const query = `
          SELECT * FROM cr_comments 
          WHERE report_id = $1 
          ORDER BY created_at DESC
        `;
        
        const result = await client.query(query, [reportId]);
        
        // 轉換所有結果行從 snake_case 到 camelCase
        return result.rows.map(row => ({
          id: row.id,
          reportId: row.report_id,
          content: row.content,
          createdBy: row.created_by,
          createdAt: row.created_at
        })) as Comment[];
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching report comments:", error);
      throw error;
    }
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
          (building, location, report_type, description, contact, photos, created_at, status, updated_at) 
          VALUES ($1, $2, $3, $4, $5, $6::text[], DEFAULT, 'pending'::report_status, DEFAULT) 
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
          createdAt: result.rows[0].created_at,
          status: result.rows[0].status,
          improvementText: result.rows[0].improvement_text,
          updatedAt: result.rows[0].updated_at
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
    try {
      const client = await pool.connect();
      
      try {
        const query = `
          SELECT * FROM cr_reports 
          WHERE id = $1
        `;
        
        const result = await client.query(query, [id]);
        
        if (result.rows.length === 0) {
          return undefined;
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
          createdAt: result.rows[0].created_at,
          status: result.rows[0].status,
          improvementText: result.rows[0].improvement_text,
          updatedAt: result.rows[0].updated_at
        };
        
        return reportResult as Report;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      throw error;
    }
  }

  async getAllReports(): Promise<Report[]> {
    try {
      const client = await pool.connect();
      
      try {
        const query = `
          SELECT * FROM cr_reports 
          ORDER BY created_at DESC
        `;
        
        const result = await client.query(query);
        
        // 轉換所有結果行從 snake_case 到 camelCase
        return result.rows.map(row => ({
          id: row.id,
          building: row.building,
          location: row.location,
          reportType: row.report_type,
          description: row.description,
          contact: row.contact,
          photos: row.photos,
          createdAt: row.created_at,
          status: row.status,
          improvementText: row.improvement_text,
          updatedAt: row.updated_at
        })) as Report[];
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching all reports:", error);
      throw error;
    }
  }
  
  async getLocationReportStatus(): Promise<LocationStatus[]> {
    try {
      const client = await pool.connect();
      
      try {
        // 使用原生 SQL 查詢來獲取按位置分組的報告狀態
        const query = `
          SELECT 
            building, 
            location, 
            COUNT(*) as report_count, 
            MAX(created_at) as latest_report_date
          FROM 
            cr_reports
          GROUP BY 
            building, location
          ORDER BY 
            building, location
        `;
        
        const result = await client.query(query);
        
        // 將結果轉換為 LocationStatus 對象數組
        return result.rows.map(row => ({
          building: row.building,
          location: row.location,
          reportCount: parseInt(row.report_count),
          latestReportDate: row.latest_report_date ? new Date(row.latest_report_date).toISOString() : null
        }));
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error getting location report status:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
