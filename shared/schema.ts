import { pgTable, text, serial, integer, boolean, json, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("cr_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// 報告狀態枚舉
export const statusEnum = pgEnum("report_status", [
  "pending",   // 待處理
  "processing", // 處理中
  "completed",  // 已完成
  "rejected"    // 不處理
]);

// Community report schema
export const reports = pgTable("cr_reports", {
  id: serial("id").primaryKey(),
  building: text("building").notNull(),
  location: text("location").notNull(),
  reportType: text("report_type").notNull(),
  description: text("description").notNull(),
  contact: text("contact"),
  photos: json("photos").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: statusEnum("status").default("pending").notNull(),
  improvementText: text("improvement_text"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 報告評論資料表
export const comments = pgTable("cr_comments", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull().references(() => reports.id),
  content: text("content").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  status: true,
  improvementText: true,
  updatedAt: true,
});

export const updateReportSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "rejected"]),
  improvementText: z.string().optional(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const reportValidationSchema = insertReportSchema.extend({
  building: z.string().min(1, { message: "請選擇棟別" }),
  location: z.string().min(1, { message: "請選擇區域/樓層" }),
  reportType: z.string().min(1, { message: "請選擇回報改善類型" }),
  description: z.string().min(1, { message: "請填寫問題描述" }).max(500, { message: "描述不能超過500字" }),
  photos: z.array(z.string()).min(1, { message: "請至少上傳一張照片" }),
  contact: z.string().optional(),
});

export const commentValidationSchema = insertCommentSchema.extend({
  content: z.string().min(1, { message: "評論不能為空" }).max(500, { message: "評論不能超過500字" }),
  reportId: z.number().int().positive(),
  createdBy: z.string().min(1, { message: "請填寫您的姓名" }),
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type UpdateReport = z.infer<typeof updateReportSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Report = typeof reports.$inferSelect;
export type Comment = typeof comments.$inferSelect;
