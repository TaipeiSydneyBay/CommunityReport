import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

// 定義報告類型
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

// 棟別選項
const buildingOptions = [
  '全部',
  'A棟',
  'B棟',
  'C棟',
  'D棟',
  'E棟',
  'F棟',
  'G棟',
  'H棟',
  'I棟',
  'J棟',
  '戶外公設',
  '停車場'
];

export default function Dashboard() {
  const [selectedBuilding, setSelectedBuilding] = useState('全部');
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  
  // 獲取所有報告
  const { data: reports = [], isLoading, isError } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });

  // 當選擇的棟別改變時過濾報告
  useEffect(() => {
    if (reports) {
      if (selectedBuilding === '全部') {
        setFilteredReports(reports);
      } else {
        setFilteredReports(reports.filter(report => report.building === selectedBuilding));
      }
    }
  }, [selectedBuilding, reports]);

  // 按區域/樓層分組報告
  const reportsByLocation = filteredReports.reduce((acc, report) => {
    if (!acc[report.location]) {
      acc[report.location] = [];
    }
    acc[report.location].push(report);
    return acc;
  }, {} as Record<string, Report[]>);

  // 獲取唯一的位置列表
  const locations = Object.keys(reportsByLocation).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        社區回報儀表板
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>報告統計</CardTitle>
          <CardDescription>查看所有回報的摘要</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-500 font-medium">總報告數</div>
              <div className="text-3xl font-bold">{reports.length}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-500 font-medium">今日報告數</div>
              <div className="text-3xl font-bold">
                {reports.filter(report => {
                  const today = new Date();
                  const reportDate = new Date(report.createdAt);
                  return (
                    reportDate.getDate() === today.getDate() &&
                    reportDate.getMonth() === today.getMonth() &&
                    reportDate.getFullYear() === today.getFullYear()
                  );
                }).length}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-sm text-green-500 font-medium">已回報棟別</div>
              <div className="text-3xl font-bold">
                {new Set(reports.map(report => report.building)).size}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Select
          value={selectedBuilding}
          onValueChange={(value) => setSelectedBuilding(value)}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="選擇棟別" />
          </SelectTrigger>
          <SelectContent>
            {buildingOptions.map(building => (
              <SelectItem key={building} value={building}>
                {building}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center p-8">載入中...</div>
      ) : isError ? (
        <div className="text-center p-8 text-red-500">無法載入報告數據。請稍後再試。</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">目前沒有符合條件的回報記錄</p>
        </div>
      ) : (
        <div className="space-y-10">
          {locations.map(location => {
            const firstReport = reportsByLocation[location][0];
            return (
              <Card key={location} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">{location}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        <span className="inline-flex items-center">
                          <Badge variant="secondary" className="mr-2">{firstReport.building}</Badge>
                          最新回報日期: {format(new Date(firstReport.createdAt), 'yyyy/MM/dd')}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {reportsByLocation[location].length} 筆回報
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>回報類型</TableHead>
                        <TableHead>問題描述</TableHead>
                        <TableHead>照片</TableHead>
                        <TableHead>日期</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsByLocation[location].map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {{
                                'ceiling_wall_floor': '天地壁',
                                'socket_switch': '插座/開關',
                                'paint': '油漆',
                                'equipment_location': '設備安裝位置',
                                'cleaning': '清潔',
                                'water_leakage': '漏水',
                                'major_defect': '與圖面不符之重大短缺',
                                'other_marked': '其他-請在圖面標註類型'
                              }[report.reportType] || report.reportType}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">{report.description}</TableCell>
                          <TableCell>
                            {report.photos && report.photos.length > 0 ? (
                              <div className="flex space-x-1">
                                {report.photos.slice(0, 2).map((url: string, idx: number) => (
                                  <a 
                                    key={idx} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-10 h-10 rounded overflow-hidden border border-gray-200"
                                  >
                                    <img 
                                      src={url} 
                                      alt={`照片 ${idx + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </a>
                                ))}
                                {report.photos.length > 2 && (
                                  <span className="text-sm text-gray-500">+{report.photos.length - 2}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">無照片</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            {format(new Date(report.createdAt), 'yyyy/MM/dd HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Link href={`/report/${report.id}`}>
                              <button className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium">
                                <Eye className="h-4 w-4 mr-1" />
                                查看詳情
                              </button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}