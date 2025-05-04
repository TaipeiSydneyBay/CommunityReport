import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileType,
  AlignLeft,
  User,
  Camera,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  MessageSquare,
  Send
} from "lucide-react";
import { locationLabels } from "@/components/CategorySelectionSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Report {
  id: number;
  building: string;
  location: string;
  reportType: string;
  description: string;
  contact: string;
  photos: string[];
  createdAt: string;
  status: "pending" | "processing" | "completed" | "rejected";
  improvementText?: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  reportId: number;
  content: string;
  createdBy: string;
  createdAt: string;
}

// 報告類型中文對照表
const reportTypeMap: Record<string, string> = {
  ceiling_wall_floor: "天地壁",
  socket_switch: "插座/開關",
  paint: "油漆",
  equipment_location: "設備安裝位置",
  cleaning: "清潔",
  water_leakage: "漏水",
  major_defect: "與圖面不符之重大短缺",
  other_marked: "其他-請在圖面標註類型",
};

// 狀態中文對照表
const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  pending: { 
    label: "待處理", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: Clock 
  },
  processing: { 
    label: "處理中", 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: Wrench 
  },
  completed: { 
    label: "已完成", 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: CheckCircle 
  },
  rejected: { 
    label: "不處理", 
    color: "bg-red-100 text-red-800 border-red-200", 
    icon: XCircle 
  },
};

export default function ReportDetail() {
  const [, params] = useRoute("/report/:id");
  const reportId = params?.id;
  const [statusEditing, setStatusEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [improvementText, setImprovementText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`/api/reports/${reportId}`],
    enabled: !!reportId,
  });
  
  // 提取報告和評論
  const report: Report | undefined = data ? (data as any).report || data : undefined;
  const comments: Comment[] = data && (data as any).comments ? (data as any).comments : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">載入回報資料中...</p>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500">無法載入回報資料</CardTitle>
            <CardDescription>
              找不到 ID 為 {reportId} 的回報記錄，或發生了錯誤。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回儀表板
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 新增狀態更新函數
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { status: string; improvementText?: string }) => {
      return apiRequest(`/api/reports/${reportId}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reports/${reportId}`] });
      setStatusEditing(false);
      toast({
        title: "改善狀態已更新",
        description: "報告狀態已成功更新",
      });
    },
    onError: (error: any) => {
      toast({
        title: "更新狀態失敗",
        description: error.message || "無法更新報告狀態，請稍後再試",
        variant: "destructive",
      });
    },
  });

  // 新增評論函數
  const addCommentMutation = useMutation({
    mutationFn: async (data: { content: string; createdBy: string }) => {
      return apiRequest(`/api/reports/${reportId}/comments`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reports/${reportId}`] });
      setNewComment("");
      toast({
        title: "評論已新增",
        description: "您的評論已成功新增",
      });
    },
    onError: (error: any) => {
      toast({
        title: "新增評論失敗",
        description: error.message || "無法新增評論，請稍後再試",
        variant: "destructive",
      });
    },
  });

  // 處理狀態更新提交
  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      toast({
        title: "請選擇狀態",
        description: "請選擇一個改善狀態",
        variant: "destructive",
      });
      return;
    }

    const updateData: any = { status: selectedStatus };
    if (improvementText.trim()) {
      updateData.improvementText = improvementText.trim();
    }

    updateStatusMutation.mutate(updateData);
  };

  // 處理評論提交
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "評論不能為空",
        description: "請輸入評論內容",
        variant: "destructive",
      });
      return;
    }

    if (!commenterName.trim()) {
      toast({
        title: "請輸入姓名",
        description: "請提供您的姓名",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({ 
      content: newComment.trim(), 
      createdBy: commenterName.trim() 
    });
  };
  
  // 初始加載報告時設置狀態和改善文字
  useEffect(() => {
    if (report) {
      setSelectedStatus(report.status);
      setImprovementText(report.improvementText || "");
    }
  }, [report]);

  const StatusIcon = report ? statusMap[report.status]?.icon : Clock;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回儀表板
            </Button>
          </Link>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">
                  回報詳情 #{report.id}
                </CardTitle>
                <CardDescription className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {format(new Date(report.createdAt), "yyyy/MM/dd HH:mm")}
                </CardDescription>
                {report.status && (
                  <Badge 
                    className={`mt-2 ${statusMap[report.status].color}`} 
                    variant="outline"
                  >
                    <StatusIcon className="h-3.5 w-3.5 mr-1" />
                    {statusMap[report.status].label}
                  </Badge>
                )}
              </div>
              <Badge className="text-sm" variant="outline">
                {`CR-${new Date(report.createdAt).getFullYear()}-${String(report.id).padStart(4, "0")}`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  位置
                </h3>
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {locationLabels[report.location] || report.location}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <FileType className="h-4 w-4 mr-1" />
                  回報類型
                </h3>
                <div className="mb-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
                    {reportTypeMap[report.reportType] || report.reportType}
                  </Badge>
                </div>

                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <AlignLeft className="h-4 w-4 mr-1" />
                  問題描述
                </h3>
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {report.description}
                  </p>
                </div>

                {report.contact && (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <User className="h-4 w-4 mr-1" />
                      聯絡資訊
                    </h3>
                    <div className="mb-4">
                      <p className="text-gray-700">{report.contact}</p>
                    </div>
                  </>
                )}
                
                {report.improvementText && (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Wrench className="h-4 w-4 mr-1" />
                      改善說明
                    </h3>
                    <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-100">
                      <p className="whitespace-pre-wrap text-gray-700">
                        {report.improvementText}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        最後更新: {format(new Date(report.updatedAt), "yyyy/MM/dd HH:mm")}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3">
                  <Camera className="h-4 w-4 mr-1" />
                  問題照片 ({report.photos.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {report.photos.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <img
                        src={url}
                        alt={`問題照片 ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* 狀態更新區塊 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                改善狀態管理
              </h3>
              
              {statusEditing ? (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">狀態</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="選擇狀態" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">待處理</SelectItem>
                        <SelectItem value="processing">處理中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                        <SelectItem value="rejected">不處理</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">改善說明</label>
                    <Textarea
                      placeholder="輸入改善處理說明..."
                      value={improvementText}
                      onChange={(e) => setImprovementText(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleStatusUpdate}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          儲存中...
                        </>
                      ) : "儲存變更"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setStatusEditing(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">目前狀態</p>
                    <Badge className={statusMap[report.status].color}>
                      <StatusIcon className="h-3.5 w-3.5 mr-1" />
                      {statusMap[report.status].label}
                    </Badge>
                  </div>
                  <Button onClick={() => setStatusEditing(true)}>
                    <Wrench className="h-4 w-4 mr-2" />
                    更新狀態
                  </Button>
                </div>
              )}
            </div>
            
            {/* 評論區塊 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                討論區
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                {/* 評論列表 */}
                <div className="mb-6">
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-md border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{comment.createdBy}</p>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.createdAt), "yyyy/MM/dd HH:mm")}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>尚無評論</p>
                    </div>
                  )}
                </div>
                
                {/* 新增評論表單 */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">新增評論</h4>
                  <div className="mb-3">
                    <Input
                      placeholder="您的姓名"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="輸入您的評論..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <Button 
                    onClick={handleCommentSubmit}
                    disabled={addCommentMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        提交評論
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
