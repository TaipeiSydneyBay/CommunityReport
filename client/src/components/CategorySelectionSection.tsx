import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectionSectionProps {
  building: string;
  setBuilding: (value: string) => void;
  reportType: string;
  setReportType: (value: string) => void;
}

export function CategorySelectionSection({ 
  building, 
  setBuilding, 
  reportType, 
  setReportType 
}: CategorySelectionSectionProps) {
  return (
    <section className="px-4 py-2 border-t border-gray-100">
      <h2 className="text-lg font-medium mb-4">檢舉類別</h2>
      
      {/* Building Selection */}
      <div className="mb-4">
        <Label htmlFor="building" className="text-sm font-medium text-gray-700 mb-1">
          棟別 <span className="text-red-500">*</span>
        </Label>
        <Select value={building} onValueChange={setBuilding}>
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
              <SelectItem value="public">公共區域</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {/* Report Type Selection */}
      <div className="mb-4">
        <Label htmlFor="report-type" className="text-sm font-medium text-gray-700 mb-1">
          檢舉類型 <span className="text-red-500">*</span>
        </Label>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger id="report-type" className="w-full rounded-lg border border-gray-300 py-3 px-4">
            <SelectValue placeholder="請選擇檢舉類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="noise">噪音問題</SelectItem>
              <SelectItem value="safety">安全隱患</SelectItem>
              <SelectItem value="facility">設施損壞</SelectItem>
              <SelectItem value="hygiene">衛生問題</SelectItem>
              <SelectItem value="parking">停車違規</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
