import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface CategorySelectionSectionProps {
  building: string;
  setBuilding: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  reportType: string;
  setReportType: (value: string) => void;
}

// 位置狀態介面
interface LocationStatus {
  building: string;
  location: string;
  reportCount: number;
  latestReportDate: string | null;
}

export function CategorySelectionSection({ 
  building, 
  setBuilding, 
  location,
  setLocation,
  reportType, 
  setReportType 
}: CategorySelectionSectionProps) {
  // 使用 React Query 獲取所有位置的報告狀態
  const { data: locationsData, isLoading } = useQuery({
    queryKey: ['/api/locations/status'],
    staleTime: 60000, // 1分鐘內不重新獲取
  });
  
  // 將數據轉換為更易於使用的格式
  const [locationStatusMap, setLocationStatusMap] = useState<Record<string, LocationStatus>>({});
  
  useEffect(() => {
    if (locationsData?.locationStatus) {
      const statusMap: Record<string, LocationStatus> = {};
      locationsData.locationStatus.forEach((status: LocationStatus) => {
        statusMap[status.location] = status;
      });
      setLocationStatusMap(statusMap);
    }
  }, [locationsData]);
  
  // 判斷某位置是否有報告
  const hasReports = (locationId: string) => {
    return locationStatusMap[locationId] !== undefined;
  };
  
  // 獲取某位置的報告數量
  const getReportCount = (locationId: string) => {
    return locationStatusMap[locationId]?.reportCount || 0;
  };
  
  return (
    <section className="px-4 py-2 border-t border-gray-100">
      <h2 className="text-lg font-medium mb-4">回報改善類別</h2>
      
      {/* Building Selection */}
      <div className="mb-4">
        <Label htmlFor="building" className="text-sm font-medium text-gray-700 mb-1">
          棟別 <span className="text-red-500">*</span>
        </Label>
        <Select value={building} onValueChange={(value) => {
          setBuilding(value);
          setLocation(''); // 當棟別改變時，清空位置選擇
        }}>
          <SelectTrigger id="building" className="w-full rounded-lg border border-gray-300 py-3 px-4">
            <SelectValue placeholder="請選擇棟別" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="A">A 棟</SelectItem>
              <SelectItem value="B">B 棟</SelectItem>
              <SelectItem value="C">C 棟</SelectItem>
              <SelectItem value="D">D 棟</SelectItem>
              <SelectItem value="E">E 棟</SelectItem>
              <SelectItem value="F">F 棟</SelectItem>
              <SelectItem value="G">G 棟</SelectItem>
              <SelectItem value="H">H 棟</SelectItem>
              <SelectItem value="I">I 棟</SelectItem>
              <SelectItem value="J">J 棟</SelectItem>
              <SelectItem value="outdoor">戶外公設</SelectItem>
              <SelectItem value="parking">停車場</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {/* Location Selection */}
      <div className="mb-4">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">
          區域/樓層 <span className="text-red-500">*</span>
        </Label>
        <Select value={location} onValueChange={setLocation} disabled={!building}>
          <SelectTrigger id="location" className="w-full rounded-lg border border-gray-300 py-3 px-4">
            <SelectValue placeholder="請先選擇棟別" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {building === 'A' && (
                <>
                  <SelectItem value="A-lobby">
                    菲儷大廳 {hasReports("A-lobby") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-lobby")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-stairs">
                    藝術梯廳 {hasReports("A-stairs") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-stairs")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-reading">
                    敦峰閱覽室 {hasReports("A-reading") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-reading")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-kids">
                    小王子親子共讀區 {hasReports("A-kids") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-kids")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-emergency">
                    安全梯間 {hasReports("A-emergency") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-emergency")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-elevator">
                    梯廳 {hasReports("A-elevator") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-elevator")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-roof">
                    頂樓 {hasReports("A-roof") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-roof")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-1F">
                    1F {hasReports("A-1F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-1F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-2F">
                    2F {hasReports("A-2F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-2F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-3F">
                    3F {hasReports("A-3F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-3F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-4F">
                    4F {hasReports("A-4F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-4F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-5F">
                    5F {hasReports("A-5F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-5F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-6F">
                    6F {hasReports("A-6F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-6F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-7F">
                    7F {hasReports("A-7F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-7F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-8F">
                    8F {hasReports("A-8F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-8F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-9F">
                    9F {hasReports("A-9F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-9F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="A-10F">
                    10F {hasReports("A-10F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("A-10F")}筆回報</Badge>}
                  </SelectItem>
                </>
              )}
              {building === 'B' && (
                <>
                  <SelectItem value="B-lobby">琴韻大廳</SelectItem>
                  <SelectItem value="B-hall">安幔交誼廳</SelectItem>
                  <SelectItem value="B-stairs">藝術梯廳</SelectItem>
                  <SelectItem value="B-reading">人文閱讀館</SelectItem>
                  <SelectItem value="B-emergency">安全梯間</SelectItem>
                  <SelectItem value="B-elevator">梯廳</SelectItem>
                  <SelectItem value="B-roof">頂樓</SelectItem>
                  <SelectItem value="B-1F">1F</SelectItem>
                  <SelectItem value="B-2F">2F</SelectItem>
                  <SelectItem value="B-3F">3F</SelectItem>
                  <SelectItem value="B-4F">4F</SelectItem>
                  <SelectItem value="B-5F">5F</SelectItem>
                  <SelectItem value="B-6F">6F</SelectItem>
                  <SelectItem value="B-7F">7F</SelectItem>
                  <SelectItem value="B-8F">8F</SelectItem>
                  <SelectItem value="B-9F">9F</SelectItem>
                  <SelectItem value="B-10F">10F</SelectItem>
                </>
              )}
              {building === 'C' && (
                <>
                  <SelectItem value="C-tunnel">多倫圖書隧道</SelectItem>
                  <SelectItem value="C-classroom">多媒體雙語教室</SelectItem>
                  <SelectItem value="C-study">集雅學學區</SelectItem>
                  <SelectItem value="C-reading">松濤閱讀館</SelectItem>
                  <SelectItem value="C-emergency">安全梯間</SelectItem>
                  <SelectItem value="C-elevator">梯廳</SelectItem>
                  <SelectItem value="C-roof">頂樓</SelectItem>
                  <SelectItem value="C-1F">1F</SelectItem>
                  <SelectItem value="C-2F">2F</SelectItem>
                  <SelectItem value="C-3F">3F</SelectItem>
                  <SelectItem value="C-4F">4F</SelectItem>
                  <SelectItem value="C-5F">5F</SelectItem>
                  <SelectItem value="C-6F">6F</SelectItem>
                  <SelectItem value="C-7F">7F</SelectItem>
                  <SelectItem value="C-8F">8F</SelectItem>
                  <SelectItem value="C-9F">9F</SelectItem>
                  <SelectItem value="C-10F">10F</SelectItem>
                  <SelectItem value="C-11F">11F</SelectItem>
                </>
              )}
              {building === 'D' && (
                <>
                  <SelectItem value="D-lobby">
                    伯爵大廳 {hasReports("D-lobby") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-lobby")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-view">
                    綠中海景觀區 {hasReports("D-view") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-view")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-stairs">
                    藝術梯廳 {hasReports("D-stairs") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-stairs")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-gym">
                    海力士健身房 {hasReports("D-gym") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-gym")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-emergency">
                    安全梯間 {hasReports("D-emergency") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-emergency")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-elevator">
                    梯廳 {hasReports("D-elevator") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-elevator")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-roof">
                    頂樓 {hasReports("D-roof") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-roof")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-1F">
                    1F {hasReports("D-1F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-1F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-2F">
                    2F {hasReports("D-2F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-2F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-3F">
                    3F {hasReports("D-3F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-3F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-4F">
                    4F {hasReports("D-4F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-4F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-5F">
                    5F {hasReports("D-5F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-5F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-6F">
                    6F {hasReports("D-6F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-6F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-7F">
                    7F {hasReports("D-7F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-7F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-8F">
                    8F {hasReports("D-8F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-8F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-9F">
                    9F {hasReports("D-9F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-9F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-10F">
                    10F {hasReports("D-10F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-10F")}筆回報</Badge>}
                  </SelectItem>
                  <SelectItem value="D-11F">
                    11F {hasReports("D-11F") && <Badge className="ml-2 bg-yellow-500" variant="secondary">已有{getReportCount("D-11F")}筆回報</Badge>}
                  </SelectItem>
                </>
              )}
              {building === 'E' && (
                <>
                  <SelectItem value="E-bar">美式運動BAR</SelectItem>
                  <SelectItem value="E-media">多媒體影音廳</SelectItem>
                  <SelectItem value="E-climbing">攀岩活動區</SelectItem>
                  <SelectItem value="E-pool">撞球室</SelectItem>
                  <SelectItem value="E-pingpong">桌球室</SelectItem>
                  <SelectItem value="E-kids">小天使快樂天堂</SelectItem>
                  <SelectItem value="E-emergency">安全梯間</SelectItem>
                  <SelectItem value="E-elevator">梯廳</SelectItem>
                  <SelectItem value="E-roof">頂樓</SelectItem>
                  <SelectItem value="E-1F">1F</SelectItem>
                  <SelectItem value="E-2F">2F</SelectItem>
                  <SelectItem value="E-3F">3F</SelectItem>
                  <SelectItem value="E-4F">4F</SelectItem>
                  <SelectItem value="E-5F">5F</SelectItem>
                  <SelectItem value="E-6F">6F</SelectItem>
                  <SelectItem value="E-7F">7F</SelectItem>
                  <SelectItem value="E-8F">8F</SelectItem>
                  <SelectItem value="E-9F">9F</SelectItem>
                  <SelectItem value="E-10F">10F</SelectItem>
                  <SelectItem value="E-11F">11F</SelectItem>
                </>
              )}
              {building === 'F' && (
                <>
                  <SelectItem value="F-lobby">大廳</SelectItem>
                  <SelectItem value="F-kitchen">複合餐飲教室</SelectItem>
                  <SelectItem value="F-meeting">多功能會議廳</SelectItem>
                  <SelectItem value="F-laundry">洗衣中心</SelectItem>
                  <SelectItem value="F-view">悠天地景觀區</SelectItem>
                  <SelectItem value="F-emergency">安全梯間</SelectItem>
                  <SelectItem value="F-elevator">梯廳</SelectItem>
                  <SelectItem value="F-roof">頂樓</SelectItem>
                  <SelectItem value="F-1F">1F</SelectItem>
                  <SelectItem value="F-2F">2F</SelectItem>
                  <SelectItem value="F-3F">3F</SelectItem>
                  <SelectItem value="F-4F">4F</SelectItem>
                  <SelectItem value="F-5F">5F</SelectItem>
                  <SelectItem value="F-6F">6F</SelectItem>
                  <SelectItem value="F-7F">7F</SelectItem>
                  <SelectItem value="F-8F">8F</SelectItem>
                  <SelectItem value="F-9F">9F</SelectItem>
                  <SelectItem value="F-10F">10F</SelectItem>
                  <SelectItem value="F-11F">11F</SelectItem>
                </>
              )}
              {building === 'G' && (
                <>
                  <SelectItem value="G-emergency">安全梯間</SelectItem>
                  <SelectItem value="G-elevator">梯廳</SelectItem>
                  <SelectItem value="G-roof">頂樓</SelectItem>
                  <SelectItem value="G-1F">1F</SelectItem>
                  <SelectItem value="G-2F">2F</SelectItem>
                  <SelectItem value="G-3F">3F</SelectItem>
                  <SelectItem value="G-4F">4F</SelectItem>
                  <SelectItem value="G-5F">5F</SelectItem>
                  <SelectItem value="G-6F">6F</SelectItem>
                  <SelectItem value="G-7F">7F</SelectItem>
                  <SelectItem value="G-8F">8F</SelectItem>
                  <SelectItem value="G-9F">9F</SelectItem>
                  <SelectItem value="G-10F">10F</SelectItem>
                  <SelectItem value="G-11F">11F</SelectItem>
                </>
              )}
              {building === 'H' && (
                <>
                  <SelectItem value="H-lobby">文華大廳</SelectItem>
                  <SelectItem value="H-stairs">藝術梯廳</SelectItem>
                  <SelectItem value="H-chess">尊爵棋藝室</SelectItem>
                  <SelectItem value="H-emergency">安全梯間</SelectItem>
                  <SelectItem value="H-elevator">梯廳</SelectItem>
                  <SelectItem value="H-roof">頂樓</SelectItem>
                  <SelectItem value="H-1F">1F</SelectItem>
                  <SelectItem value="H-2F">2F</SelectItem>
                  <SelectItem value="H-3F">3F</SelectItem>
                  <SelectItem value="H-4F">4F</SelectItem>
                  <SelectItem value="H-5F">5F</SelectItem>
                  <SelectItem value="H-6F">6F</SelectItem>
                  <SelectItem value="H-7F">7F</SelectItem>
                  <SelectItem value="H-8F">8F</SelectItem>
                  <SelectItem value="H-9F">9F</SelectItem>
                  <SelectItem value="H-10F">10F</SelectItem>
                  <SelectItem value="H-11F">11F</SelectItem>
                </>
              )}
              {building === 'I' && (
                <>
                  <SelectItem value="I-emergency">安全梯間</SelectItem>
                  <SelectItem value="I-elevator">梯廳</SelectItem>
                  <SelectItem value="I-roof">頂樓</SelectItem>
                  <SelectItem value="I-1F">1F</SelectItem>
                  <SelectItem value="I-2F">2F</SelectItem>
                  <SelectItem value="I-3F">3F</SelectItem>
                  <SelectItem value="I-4F">4F</SelectItem>
                  <SelectItem value="I-5F">5F</SelectItem>
                  <SelectItem value="I-6F">6F</SelectItem>
                  <SelectItem value="I-7F">7F</SelectItem>
                  <SelectItem value="I-8F">8F</SelectItem>
                  <SelectItem value="I-9F">9F</SelectItem>
                  <SelectItem value="I-10F">10F</SelectItem>
                  <SelectItem value="I-11F">11F</SelectItem>
                </>
              )}
              {building === 'J' && (
                <>
                  <SelectItem value="J-lobby">文華大廳</SelectItem>
                  <SelectItem value="J-stairs">藝術梯廳</SelectItem>
                  <SelectItem value="J-chess">尊爵棋藝室</SelectItem>
                  <SelectItem value="J-emergency">安全梯間</SelectItem>
                  <SelectItem value="J-elevator">梯廳</SelectItem>
                  <SelectItem value="J-roof">頂樓</SelectItem>
                  <SelectItem value="J-1F">1F</SelectItem>
                  <SelectItem value="J-2F">2F</SelectItem>
                  <SelectItem value="J-3F">3F</SelectItem>
                  <SelectItem value="J-4F">4F</SelectItem>
                  <SelectItem value="J-5F">5F</SelectItem>
                  <SelectItem value="J-6F">6F</SelectItem>
                  <SelectItem value="J-7F">7F</SelectItem>
                  <SelectItem value="J-8F">8F</SelectItem>
                  <SelectItem value="J-9F">9F</SelectItem>
                  <SelectItem value="J-10F">10F</SelectItem>
                  <SelectItem value="J-11F">11F</SelectItem>
                </>
              )}
              {building === 'outdoor' && (
                <>
                  <SelectItem value="outdoor-common">戶外公設</SelectItem>
                </>
              )}
              {building === 'parking' && (
                <>
                  <SelectItem value="parking-B1">B1停車場</SelectItem>
                  <SelectItem value="parking-B2">B2停車場</SelectItem>
                  <SelectItem value="parking-B3">B3停車場</SelectItem>
                  <SelectItem value="parking-AB">AB棟停車場</SelectItem>
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {/* Report Type Selection */}
      <div className="mb-4">
        <Label htmlFor="report-type" className="text-sm font-medium text-gray-700 mb-1">
          回報改善類型 <span className="text-red-500">*</span>
        </Label>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger id="report-type" className="w-full rounded-lg border border-gray-300 py-3 px-4">
            <SelectValue placeholder="請選擇回報改善類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ceiling_wall_floor">天地壁</SelectItem>
              <SelectItem value="socket_switch">插座/開關</SelectItem>
              <SelectItem value="paint">油漆</SelectItem>
              <SelectItem value="equipment_location">設備安裝位置</SelectItem>
              <SelectItem value="cleaning">清潔</SelectItem>
              <SelectItem value="water_leakage">漏水</SelectItem>
              <SelectItem value="major_defect">與圖面不符之重大短缺</SelectItem>
              <SelectItem value="other_marked">其他-請在圖面標註類型</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
