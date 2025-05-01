import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { BarChart, Clipboard, Camera, Send, PieChart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold text-gray-900">社區回報改善系統</h1>
          <p className="text-gray-600 mt-2">提交回報改善以解決社區問題</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>新增回報改善</CardTitle>
              <CardDescription>提交社區問題改善報告</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/report">
                <Button className="w-full">開始回報改善</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>查看回報儀表板</CardTitle>
              <CardDescription>瀏覽所有社區回報統計</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full" variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  查看儀表板
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">社區回報改善流程</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">1. 上傳照片</h3>
                    <p className="text-sm text-gray-500">拍攝並上傳問題照片</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                    <Clipboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">2. 選擇類別</h3>
                    <p className="text-sm text-gray-500">選擇問題所在棟別與類型</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">3. 問題描述與反映</h3>
                    <p className="text-sm text-gray-500">詳細描述改善需求及建議</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">4. 提交回報改善</h3>
                    <p className="text-sm text-gray-500">完成後提交回報改善單</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
