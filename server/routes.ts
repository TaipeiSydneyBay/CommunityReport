import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { reportValidationSchema, updateReportSchema, commentValidationSchema } from "@shared/schema";
import multer from "multer";
import { uploadToS3, generatePresignedUrl } from "./s3";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get S3 presigned URL for direct upload
  app.get("/api/presigned-url", async (req: Request, res: Response) => {
    try {
      const fileType = req.query.fileType as string;
      const fileName = req.query.fileName as string;
      
      if (!fileType || !fileName) {
        return res.status(400).json({ message: "fileType and fileName are required" });
      }

      const presignedUrl = await generatePresignedUrl(fileName, fileType);
      return res.json({ presignedUrl });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });
  
  // Upload image to S3
  app.post("/api/upload", upload.single("photo"), async (req: Request, res: Response) => {
    try {
      console.log("Upload request received:", { 
        body: req.body,
        file: req.file ? "File received" : "No file received",
        headers: req.headers,
      });
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      console.log("Processing file:", {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
      
      const s3URL = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      console.log("File uploaded to S3:", s3URL);
      
      return res.json({ url: s3URL });
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Create a new report
  app.post("/api/reports", async (req: Request, res: Response) => {
    try {
      const reportData = reportValidationSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      
      // Generate report code with format CR-YYYY-XXXX
      const year = new Date().getFullYear();
      const reportCode = `CR-${year}-${String(report.id).padStart(4, '0')}`;
      
      return res.status(201).json({ report, reportCode });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating report:", error);
      return res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Get all reports
  app.get("/api/reports", async (_req: Request, res: Response) => {
    try {
      const reports = await storage.getAllReports();
      return res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      return res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get a specific report
  app.get("/api/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }

      const report = await storage.getReportById(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      // 取得評論
      const comments = await storage.getReportComments(id);

      return res.json({ report, comments });
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ message: "Failed to fetch report" });
    }
  });
  
  // Update report status and improvement text
  app.patch("/api/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      // 驗證更新資料
      const updateData = updateReportSchema.parse(req.body);
      
      // 更新報告狀態
      const updatedReport = await storage.updateReportStatus(id, updateData);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      return res.json(updatedReport);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error updating report status:", error);
      return res.status(500).json({ message: "Failed to update report status" });
    }
  });
  
  // Add comment to a report
  app.post("/api/reports/:id/comments", async (req: Request, res: Response) => {
    try {
      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      // 確認報告存在
      const report = await storage.getReportById(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // 驗證評論資料
      const commentData = commentValidationSchema.parse({
        ...req.body,
        reportId
      });
      
      // 添加評論
      const comment = await storage.addComment(commentData);
      
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error adding comment:", error);
      return res.status(500).json({ message: "Failed to add comment" });
    }
  });
  
  // Get comments for a report
  app.get("/api/reports/:id/comments", async (req: Request, res: Response) => {
    try {
      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      // 獲取報告評論
      const comments = await storage.getReportComments(reportId);
      
      return res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  
  // Get location report status (for showing which locations already have reports)
  app.get("/api/locations/status", async (_req: Request, res: Response) => {
    try {
      const locationStatus = await storage.getLocationReportStatus();
      return res.json({ locationStatus });
    } catch (error) {
      console.error("Error fetching location status:", error);
      return res.status(500).json({ message: "Failed to fetch location status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
