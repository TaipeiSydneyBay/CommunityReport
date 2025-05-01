import { Link, useLocation } from "wouter";
import { PieChart, FileEdit, Home } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              社區回報系統
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <Home className="h-4 w-4 mr-1" />
                首頁
              </div>
            </Link>
            
            <Link href="/report">
              <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/report' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <FileEdit className="h-4 w-4 mr-1" />
                新增回報
              </div>
            </Link>
            
            <Link href="/dashboard">
              <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <PieChart className="h-4 w-4 mr-1" />
                儀表板
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}