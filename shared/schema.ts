import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
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

// Community report schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  building: text("building").notNull(),
  location: text("location").notNull(),
  reportType: text("report_type").notNull(),
  description: text("description").notNull(),
  contact: text("contact"),
  photos: json("photos").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
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

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
