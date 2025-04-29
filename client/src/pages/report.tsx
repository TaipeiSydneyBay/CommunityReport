import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoUploadSection } from "@/components/PhotoUploadSection";
import { CategorySelectionSection } from "@/components/CategorySelectionSection";
import { DescriptionSection } from "@/components/DescriptionSection";
import { SuccessModal } from "@/components/SuccessModal";
import { ErrorModal } from "@/components/ErrorModal";
import { reportValidationSchema } from "@shared/schema";

export default function Report() {
  const [, navigate] = useLocation();
  const [photos, setPhotos] = useState<{url: string, name: string}[]>([]);
  const [building, setBuilding] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [reportType, setReportType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reportCode, setReportCode] = useState<string>("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      const reportData = {
        building,
        location,
        reportType,
        description,
        contact,
        photos: photos.map(photo => photo.url)
      };
      
      try {
        reportValidationSchema.parse(reportData);
      } catch (error: any) {
        const errorMessages = error.errors && error.errors.length > 0 
          ? error.errors.map((e: any) => e.message).join(", ")
          : "表單驗證失敗，請檢查所有欄位";
        throw new Error(errorMessages);
      }

      const response = await apiRequest("POST", "/api/reports", reportData);
      return await response.json();
    },
    onSuccess: (data) => {
      setReportCode(data.reportCode);
      setSuccessModalOpen(true);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    }
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-sm">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button 
            className="text-gray-700" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-center">社區回報改善</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        <PhotoUploadSection photos={photos} setPhotos={setPhotos} />
        <CategorySelectionSection 
          building={building} 
          setBuilding={setBuilding} 
          location={location}
          setLocation={setLocation}
          reportType={reportType} 
          setReportType={setReportType} 
        />
        <DescriptionSection 
          description={description} 
          setDescription={setDescription} 
          contact={contact} 
          setContact={setContact} 
        />

        {/* Photo Upload Explanation Section */}
        <section className="px-4 py-4 bg-blue-50 mt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-blue-500 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">照片提交說明</h3>
              <div className="mt-1 text-xs text-blue-700">
                <p>上傳的照片將保存在安全的服務器上，並僅用於處理您的回報改善。系統支持 JPG、PNG 和 HEIC 格式，單張照片大小不超過 10MB。</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Submit Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 max-w-md mx-auto">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? "提交中..." : "提交回報改善"}
        </Button>
      </footer>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={successModalOpen} 
        onClose={handleCloseSuccessModal} 
        reportId={reportCode} 
      />

      {/* Error Modal */}
      <ErrorModal 
        isOpen={errorModalOpen} 
        onClose={() => setErrorModalOpen(false)} 
        errorMessage={errorMessage} 
      />
    </div>
  );
}
