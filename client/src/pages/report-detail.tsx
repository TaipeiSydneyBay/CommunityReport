import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, MapPin, FileType, AlignLeft, User, Camera } from 'lucide-react';
import { locationLabels } from '@/components/CategorySelectionSection';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Report {
  id: number;
  building: string;
  location: string;
  reportType: string;
  description: string;
  contact: string;
  photos: string[];
  createdAt: string;
}

// 報告類型中文對照表
const reportTypeMap: Record<string, string> = {
  'ceiling_wall_floor': '天地壁',
  'socket_switch': '插座/開關',
  'paint': '油漆',
  'equipment_location': '設備安裝位置',
  'cleaning': '清潔',
  'water_leakage': '漏水',
  'major_defect': '與圖面不符之重大短缺',
  'other_marked': '其他-請在圖面標註類型'
};

export default function ReportDetail() {
  const [, params] = useRoute('/report/:id');
  const reportId = params?.id;
  
  const { data: report, isLoading, isError } = useQuery<Report>({
    queryKey: [`/api/reports/${reportId}`],
    enabled: !!reportId
  });

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
                  {format(new Date(report.createdAt), 'yyyy/MM/dd HH:mm')}
                </CardDescription>
              </div>
              <Badge className="text-sm" variant="outline">
                {`CR-${new Date(report.createdAt).getFullYear()}-${String(report.id).padStart(4, '0')}`}
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
                    <Badge variant="secondary">{report.building}</Badge>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{locationLabels[report.location] || report.location}</span>
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
                  <p className="whitespace-pre-wrap text-gray-700">{report.description}</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}