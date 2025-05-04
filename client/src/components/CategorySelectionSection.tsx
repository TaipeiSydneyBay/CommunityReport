import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

// 匯出位置對照表，供其他組件使用
export const locationLabels: Record<string, string> = {
  // 棟別標籤
  'A': 'A 棟',
  'B': 'B 棟',
  'C': 'C 棟',
  'D': 'D 棟',
  'E': 'E 棟',
  'F': 'F 棟',
  'G': 'G 棟',
  'H': 'H 棟',
  'I': 'I 棟',
  'J': 'J 棟',
  'outdoor': '戶外公設',
  'parking': '停車場',
  
  // A 棟
  "A-lobby": "菲儷大廳",
  "A-stairs": "藝術梯廳",
  "A-reading": "敦峰閱覽室",
  "A-kids": "小王子親子共讀區",
  "A-emergency": "安全梯間",
  "A-elevator": "梯廳",
  "A-roof": "頂樓",
  "A-1F": "1F",
  "A-2F": "2F",
  "A-3F": "3F",
  "A-4F": "4F",
  "A-5F": "5F",
  "A-6F": "6F",
  "A-7F": "7F",
  "A-8F": "8F",
  "A-9F": "9F",
  "A-10F": "10F",

  // B 棟
  "B-lobby": "琴韻大廳",
  "B-hall": "安幔交誼廳",
  "B-stairs": "藝術梯廳",
  "B-reading": "人文閱讀館",
  "B-emergency": "安全梯間",
  "B-elevator": "梯廳",
  "B-roof": "頂樓",
  "B-1F": "1F",
  "B-2F": "2F",
  "B-3F": "3F",
  "B-4F": "4F",
  "B-5F": "5F",
  "B-6F": "6F",
  "B-7F": "7F",
  "B-8F": "8F",
  "B-9F": "9F",
  "B-10F": "10F",

  // C 棟
  "C-tunnel": "多倫圖書隧道",
  "C-classroom": "多媒體雙語教室",
  "C-study": "集雅學學區",
  "C-reading": "松濤閱讀館",
  "C-emergency": "安全梯間",
  "C-elevator": "梯廳",
  "C-roof": "頂樓",
  "C-1F": "1F",
  "C-2F": "2F",
  "C-3F": "3F",
  "C-4F": "4F",
  "C-5F": "5F",
  "C-6F": "6F",
  "C-7F": "7F",
  "C-8F": "8F",
  "C-9F": "9F",
  "C-10F": "10F",
  "C-11F": "11F",

  // D 棟
  "D-lobby": "伯爵大廳",
  "D-kitchen": "歐風廚房",
  "D-emergency": "安全梯間",
  "D-elevator": "梯廳",
  "D-roof": "頂樓",
  "D-1F": "1F",
  "D-2F": "2F",
  "D-3F": "3F",
  "D-4F": "4F",
  "D-5F": "5F",
  "D-6F": "6F",
  "D-7F": "7F",
  "D-8F": "8F",
  "D-9F": "9F",
  "D-10F": "10F",
  "D-11F": "11F",

  // E 棟
  "E-bar": "E-美式運動BAR",
  "E-cinema": "E-光影視聽室",
  "E-emergency": "E-安全梯間",
  "E-elevator": "E-梯廳",
  "E-roof": "E-頂樓",
  "E-1F": "E-1F",
  "E-2F": "E-2F",
  "E-3F": "E-3F",
  "E-4F": "E-4F",
  "E-5F": "E-5F",
  "E-6F": "E-6F",
  "E-7F": "E-7F",
  "E-8F": "E-8F",
  "E-9F": "E-9F",
  "E-10F": "E-10F",
  "E-11F": "E-11F",

  // F 棟
  "F-lounge": "F-雲端沙龍",
  "F-yoga": "F-靜修瑜珈",
  "F-emergency": "F-安全梯間",
  "F-elevator": "F-梯廳",
  "F-roof": "F-頂樓",
  "F-1F": "F-1F",
  "F-2F": "F-2F",
  "F-3F": "F-3F",
  "F-4F": "F-4F",
  "F-5F": "F-5F",
  "F-6F": "F-6F",
  "F-7F": "F-7F",
  "F-8F": "F-8F",
  "F-9F": "F-9F",
  "F-10F": "F-10F",
  "F-11F": "F-11F",

  // G 棟
  "G-reception": "G-接待大廳",
  "G-gym": "G-有氧健身房",
  "G-emergency": "G-安全梯間",
  "G-elevator": "G-梯廳",
  "G-roof": "G-頂樓",
  "G-1F": "G-1F",
  "G-2F": "G-2F",
  "G-3F": "G-3F",
  "G-4F": "G-4F",
  "G-5F": "G-5F",
  "G-6F": "G-6F",
  "G-7F": "G-7F",
  "G-8F": "G-8F",
  "G-9F": "G-9F",
  "G-10F": "G-10F",
  "G-11F": "G-11F",

  // H 棟
  "H-lobby": "H-奇幻大廳",
  "H-garden": "H-空中花園",
  "H-emergency": "H-安全梯間",
  "H-elevator": "H-梯廳",
  "H-roof": "H-頂樓",
  "H-1F": "H-1F",
  "H-2F": "H-2F",
  "H-3F": "H-3F",
  "H-4F": "H-4F",
  "H-5F": "H-5F",
  "H-6F": "H-6F",
  "H-7F": "H-7F",
  "H-8F": "H-8F",
  "H-9F": "H-9F",
  "H-10F": "H-10F",

  // I 棟
  "I-pool": "I-無邊際泳池",
  "I-spa": "I-渡假SPA",
  "I-emergency": "I-安全梯間",
  "I-elevator": "I-梯廳",
  "I-roof": "I-頂樓",
  "I-1F": "I-1F",
  "I-2F": "I-2F",
  "I-3F": "I-3F",
  "I-4F": "I-4F",
  "I-5F": "I-5F",
  "I-6F": "I-6F",
  "I-7F": "I-7F",
  "I-8F": "I-8F",
  "I-9F": "I-9F",

  // J 棟
  "J-entrance": "J-尊爵入口",
  "J-terrace": "J-觀景露臺",
  "J-emergency": "J-安全梯間",
  "J-elevator": "J-梯廳",
  "J-roof": "J-頂樓",
  "J-1F": "J-1F",
  "J-2F": "J-2F",
  "J-3F": "J-3F",
  "J-4F": "J-4F",
  "J-5F": "J-5F",
  "J-6F": "J-6F",
  "J-7F": "J-7F",
  "J-8F": "J-8F",

  // 戶外公設
  "outdoor-garden": "中庭花園",
  "outdoor-walkway": "步道",
  "outdoor-playground": "兒童遊戲區",
  "outdoor-pavilion": "涼亭",
  "outdoor-bbq": "BBQ區",
  "outdoor-other": "其他公共設施",

  // 停車場
  "parking-B1": "B1停車場",
  "parking-B2": "B2停車場",
  "parking-B3": "B3停車場",
  "parking-outdoor": "AB棟停車場",
};

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
  setReportType,
}: CategorySelectionSectionProps) {
  // 使用 React Query 獲取所有位置的報告狀態
  const { data, isLoading } = useQuery({
    queryKey: ["/api/locations/status"],
    staleTime: 60000, // 1分鐘內不重新獲取
  });

  // 將數據轉換為更易於使用的格式
  const [locationStatusMap, setLocationStatusMap] = useState<
    Record<string, LocationStatus>
  >({});

  useEffect(() => {
    // 確保 data 是有效的格式，並且包含 locationStatus 陣列
    const locationStatus =
      data && typeof data === "object" && "locationStatus" in data
        ? (data.locationStatus as LocationStatus[])
        : [];
    if (locationStatus.length > 0) {
      const statusMap: Record<string, LocationStatus> = {};
      locationStatus.forEach((status: LocationStatus) => {
        statusMap[status.location] = status;
      });
      setLocationStatusMap(statusMap);
    }
  }, [data]);

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
        <Label
          htmlFor="building"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          棟別 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={building}
          onValueChange={(value) => {
            setBuilding(value);
            setLocation(""); // 當棟別改變時，清空位置選擇
          }}
        >
          <SelectTrigger
            id="building"
            className="w-full rounded-lg border border-gray-300 py-3 px-4"
          >
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
        <Label
          htmlFor="location"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          區域/樓層 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={location}
          onValueChange={setLocation}
          disabled={!building}
        >
          <SelectTrigger
            id="location"
            className="w-full rounded-lg border border-gray-300 py-3 px-4"
          >
            <SelectValue placeholder="請先選擇棟別" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {building === "A" && (
                <>
                  <SelectItem value="A-lobby">
                    菲儷大廳{" "}
                    {hasReports("A-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-stairs">
                    藝術梯廳{" "}
                    {hasReports("A-stairs") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-stairs")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-reading">
                    敦峰閱覽室{" "}
                    {hasReports("A-reading") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-reading")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-kids">
                    小王子親子共讀區{" "}
                    {hasReports("A-kids") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-kids")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-emergency">
                    安全梯間{" "}
                    {hasReports("A-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-elevator">
                    梯廳{" "}
                    {hasReports("A-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-roof">
                    頂樓{" "}
                    {hasReports("A-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-1F">
                    1F{" "}
                    {hasReports("A-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-2F">
                    2F{" "}
                    {hasReports("A-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-3F">
                    3F{" "}
                    {hasReports("A-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-4F">
                    4F{" "}
                    {hasReports("A-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-5F">
                    5F{" "}
                    {hasReports("A-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-6F">
                    6F{" "}
                    {hasReports("A-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-7F">
                    7F{" "}
                    {hasReports("A-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-8F">
                    8F{" "}
                    {hasReports("A-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-9F">
                    9F{" "}
                    {hasReports("A-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="A-10F">
                    10F{" "}
                    {hasReports("A-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("A-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "B" && (
                <>
                  <SelectItem value="B-lobby">
                    琴韻大廳{" "}
                    {hasReports("B-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-hall">
                    安幔交誼廳{" "}
                    {hasReports("B-hall") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-hall")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-stairs">
                    藝術梯廳{" "}
                    {hasReports("B-stairs") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-stairs")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-reading">
                    人文閱讀館{" "}
                    {hasReports("B-reading") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-reading")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-emergency">
                    安全梯間{" "}
                    {hasReports("B-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-elevator">
                    梯廳{" "}
                    {hasReports("B-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-roof">
                    頂樓{" "}
                    {hasReports("B-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-1F">
                    1F{" "}
                    {hasReports("B-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-2F">
                    2F{" "}
                    {hasReports("B-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-3F">
                    3F{" "}
                    {hasReports("B-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-4F">
                    4F{" "}
                    {hasReports("B-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-5F">
                    5F{" "}
                    {hasReports("B-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-6F">
                    6F{" "}
                    {hasReports("B-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-7F">
                    7F{" "}
                    {hasReports("B-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-8F">
                    8F{" "}
                    {hasReports("B-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-9F">
                    9F{" "}
                    {hasReports("B-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="B-10F">
                    10F{" "}
                    {hasReports("B-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("B-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "C" && (
                <>
                  <SelectItem value="C-tunnel">
                    多倫圖書隧道{" "}
                    {hasReports("C-tunnel") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-tunnel")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-classroom">
                    多媒體雙語教室{" "}
                    {hasReports("C-classroom") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-classroom")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-study">
                    集雅學學區{" "}
                    {hasReports("C-study") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-study")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-reading">
                    松濤閱讀館{" "}
                    {hasReports("C-reading") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-reading")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-emergency">
                    安全梯間{" "}
                    {hasReports("C-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-elevator">
                    梯廳{" "}
                    {hasReports("C-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-roof">
                    頂樓{" "}
                    {hasReports("C-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-1F">
                    1F{" "}
                    {hasReports("C-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-2F">
                    2F{" "}
                    {hasReports("C-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-3F">
                    3F{" "}
                    {hasReports("C-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-4F">
                    4F{" "}
                    {hasReports("C-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-5F">
                    5F{" "}
                    {hasReports("C-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-6F">
                    6F{" "}
                    {hasReports("C-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-7F">
                    7F{" "}
                    {hasReports("C-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-8F">
                    8F{" "}
                    {hasReports("C-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-9F">
                    9F{" "}
                    {hasReports("C-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-10F">
                    10F{" "}
                    {hasReports("C-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="C-11F">
                    11F{" "}
                    {hasReports("C-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("C-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "D" && (
                <>
                  <SelectItem value="D-lobby">
                    伯爵大廳{" "}
                    {hasReports("D-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-view">
                    綠中海景觀區{" "}
                    {hasReports("D-view") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-view")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-stairs">
                    藝術梯廳{" "}
                    {hasReports("D-stairs") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-stairs")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-gym">
                    海力士健身房{" "}
                    {hasReports("D-gym") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-gym")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-emergency">
                    安全梯間{" "}
                    {hasReports("D-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-elevator">
                    梯廳{" "}
                    {hasReports("D-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-roof">
                    頂樓{" "}
                    {hasReports("D-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-1F">
                    1F{" "}
                    {hasReports("D-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-2F">
                    2F{" "}
                    {hasReports("D-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-3F">
                    3F{" "}
                    {hasReports("D-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-4F">
                    4F{" "}
                    {hasReports("D-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-5F">
                    5F{" "}
                    {hasReports("D-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-6F">
                    6F{" "}
                    {hasReports("D-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-7F">
                    7F{" "}
                    {hasReports("D-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-8F">
                    8F{" "}
                    {hasReports("D-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-8F")}筆 ��報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-9F">
                    9F{" "}
                    {hasReports("D-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-10F">
                    10F{" "}
                    {hasReports("D-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="D-11F">
                    11F{" "}
                    {hasReports("D-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("D-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "E" && (
                <>
                  <SelectItem value="E-bar">
                    美式運動BAR{" "}
                    {hasReports("E-bar") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-bar")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-media">
                    多媒體影音廳{" "}
                    {hasReports("E-media") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-media")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-climbing">
                    攀岩活動區{" "}
                    {hasReports("E-climbing") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-climbing")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-pool">
                    撞球室{" "}
                    {hasReports("E-pool") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-pool")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-pingpong">
                    桌球室{" "}
                    {hasReports("E-pingpong") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-pingpong")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-kids">
                    小天使快樂天堂{" "}
                    {hasReports("E-kids") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-kids")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-emergency">
                    安全梯間{" "}
                    {hasReports("E-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-elevator">
                    梯廳{" "}
                    {hasReports("E-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-roof">
                    頂樓{" "}
                    {hasReports("E-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-1F">
                    1F{" "}
                    {hasReports("E-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-2F">
                    2F{" "}
                    {hasReports("E-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-3F">
                    3F{" "}
                    {hasReports("E-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-4F">
                    4F{" "}
                    {hasReports("E-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-5F">
                    5F{" "}
                    {hasReports("E-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-6F">
                    6F{" "}
                    {hasReports("E-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-7F">
                    7F{" "}
                    {hasReports("E-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-8F">
                    8F{" "}
                    {hasReports("E-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-9F">
                    9F{" "}
                    {hasReports("E-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-10F">
                    10F{" "}
                    {hasReports("E-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="E-11F">
                    11F{" "}
                    {hasReports("E-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("E-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "F" && (
                <>
                  <SelectItem value="F-lobby">
                    大廳{" "}
                    {hasReports("F-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-kitchen">
                    複合餐飲教室{" "}
                    {hasReports("F-kitchen") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-kitchen")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-meeting">
                    多功能會議廳{" "}
                    {hasReports("F-meeting") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-meeting")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-laundry">
                    洗衣中心{" "}
                    {hasReports("F-laundry") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-laundry")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-view">
                    悠天地景觀區{" "}
                    {hasReports("F-view") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-view")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-emergency">
                    安全梯間{" "}
                    {hasReports("F-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-elevator">
                    梯廳{" "}
                    {hasReports("F-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-roof">
                    頂樓{" "}
                    {hasReports("F-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-1F">
                    1F{" "}
                    {hasReports("F-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-2F">
                    2F{" "}
                    {hasReports("F-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-3F">
                    3F{" "}
                    {hasReports("F-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-4F">
                    4F{" "}
                    {hasReports("F-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-5F">
                    5F{" "}
                    {hasReports("F-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-6F">
                    6F{" "}
                    {hasReports("F-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-7F">
                    7F{" "}
                    {hasReports("F-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-8F">
                    8F{" "}
                    {hasReports("F-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-9F">
                    9F{" "}
                    {hasReports("F-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-10F">
                    10F{" "}
                    {hasReports("F-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="F-11F">
                    11F{" "}
                    {hasReports("F-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("F-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "G" && (
                <>
                  <SelectItem value="G-emergency">
                    安全梯間{" "}
                    {hasReports("G-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-elevator">
                    梯廳{" "}
                    {hasReports("G-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-roof">
                    頂樓{" "}
                    {hasReports("G-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-1F">
                    1F{" "}
                    {hasReports("G-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-2F">
                    2F{" "}
                    {hasReports("G-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-3F">
                    3F{" "}
                    {hasReports("G-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-4F">
                    4F{" "}
                    {hasReports("G-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-5F">
                    5F{" "}
                    {hasReports("G-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-6F">
                    6F{" "}
                    {hasReports("G-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-7F">
                    7F{" "}
                    {hasReports("G-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-8F">
                    8F{" "}
                    {hasReports("G-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-9F">
                    9F{" "}
                    {hasReports("G-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-10F">
                    10F{" "}
                    {hasReports("G-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="G-11F">
                    11F{" "}
                    {hasReports("G-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("G-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "H" && (
                <>
                  <SelectItem value="H-lobby">
                    文華大廳{" "}
                    {hasReports("H-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-stairs">
                    藝術梯廳{" "}
                    {hasReports("H-stairs") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-stairs")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-chess">
                    尊爵棋藝室{" "}
                    {hasReports("H-chess") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-chess")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-emergency">
                    安全梯間{" "}
                    {hasReports("H-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-elevator">
                    梯廳{" "}
                    {hasReports("H-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-roof">
                    頂樓{" "}
                    {hasReports("H-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-1F">
                    1F{" "}
                    {hasReports("H-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-2F">
                    2F{" "}
                    {hasReports("H-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-3F">
                    3F{" "}
                    {hasReports("H-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-4F">
                    4F{" "}
                    {hasReports("H-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-5F">
                    5F{" "}
                    {hasReports("H-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-6F">
                    6F{" "}
                    {hasReports("H-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-7F">
                    7F{" "}
                    {hasReports("H-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-8F">
                    8F{" "}
                    {hasReports("H-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-9F">
                    9F{" "}
                    {hasReports("H-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-10F">
                    10F{" "}
                    {hasReports("H-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="H-11F">
                    11F{" "}
                    {hasReports("H-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("H-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "I" && (
                <>
                  <SelectItem value="I-emergency">
                    安全梯間{" "}
                    {hasReports("I-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-elevator">
                    梯廳{" "}
                    {hasReports("I-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-roof">
                    頂樓{" "}
                    {hasReports("I-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-1F">
                    1F{" "}
                    {hasReports("I-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-2F">
                    2F{" "}
                    {hasReports("I-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-3F">
                    3F{" "}
                    {hasReports("I-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-4F">
                    4F{" "}
                    {hasReports("I-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-5F">
                    5F{" "}
                    {hasReports("I-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-6F">
                    6F{" "}
                    {hasReports("I-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-7F">
                    7F{" "}
                    {hasReports("I-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-8F">
                    8F{" "}
                    {hasReports("I-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-9F">
                    9F{" "}
                    {hasReports("I-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-10F">
                    10F{" "}
                    {hasReports("I-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="I-11F">
                    11F{" "}
                    {hasReports("I-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("I-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "J" && (
                <>
                  <SelectItem value="J-lobby">
                    文華大廳{" "}
                    {hasReports("J-lobby") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-lobby")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-stairs">
                    藝術梯廳{" "}
                    {hasReports("J-stairs") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-stairs")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-chess">
                    尊爵棋藝室{" "}
                    {hasReports("J-chess") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-chess")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-emergency">
                    安全梯間{" "}
                    {hasReports("J-emergency") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-emergency")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-elevator">
                    梯廳{" "}
                    {hasReports("J-elevator") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-elevator")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-roof">
                    頂樓{" "}
                    {hasReports("J-roof") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-roof")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-1F">
                    1F{" "}
                    {hasReports("J-1F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-1F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-2F">
                    2F{" "}
                    {hasReports("J-2F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-2F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-3F">
                    3F{" "}
                    {hasReports("J-3F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-3F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-4F">
                    4F{" "}
                    {hasReports("J-4F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-4F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-5F">
                    5F{" "}
                    {hasReports("J-5F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-5F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-6F">
                    6F{" "}
                    {hasReports("J-6F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-6F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-7F">
                    7F{" "}
                    {hasReports("J-7F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-7F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-8F">
                    8F{" "}
                    {hasReports("J-8F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-8F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-9F">
                    9F{" "}
                    {hasReports("J-9F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-9F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-10F">
                    10F{" "}
                    {hasReports("J-10F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-10F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="J-11F">
                    11F{" "}
                    {hasReports("J-11F") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("J-11F")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "outdoor" && (
                <>
                  <SelectItem value="outdoor-common">
                    戶外公設{" "}
                    {hasReports("outdoor-common") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("outdoor-common")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
              {building === "parking" && (
                <>
                  <SelectItem value="parking-B1">
                    B1停車場{" "}
                    {hasReports("parking-B1") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("parking-B1")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="parking-B2">
                    B2停車場{" "}
                    {hasReports("parking-B2") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("parking-B2")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="parking-B3">
                    B3停車場{" "}
                    {hasReports("parking-B3") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("parking-B3")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="parking-AB">
                    AB棟停車場{" "}
                    {hasReports("parking-AB") && (
                      <Badge className="ml-2 bg-yellow-500" variant="secondary">
                        已有{getReportCount("parking-AB")}筆回報
                      </Badge>
                    )}
                  </SelectItem>
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Report Type Selection */}
      <div className="mb-4">
        <Label
          htmlFor="report-type"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          回報改善類型 <span className="text-red-500">*</span>
        </Label>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger
            id="report-type"
            className="w-full rounded-lg border border-gray-300 py-3 px-4"
          >
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
              <SelectItem value="other_marked">
                其他-請在圖面標註類型
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
