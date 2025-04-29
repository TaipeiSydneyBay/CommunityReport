import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  url: string;
  name: string;
}

interface PhotoUploadSectionProps {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

export function PhotoUploadSection({ photos, setPhotos }: PhotoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiRequest("POST", "/api/upload", formData);
      return await response.json();
    },
    onSuccess: (data, variables) => {
      setPhotos(prev => [...prev, { url: data.url, name: variables.name }]);
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "上傳失敗",
        description: "照片上傳過程中發生錯誤，請再試一次。"
      });
      setIsUploading(false);
    }
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 4 photos max
    const availableSlots = 4 - photos.length;
    if (availableSlots <= 0) {
      toast({
        variant: "destructive",
        title: "上傳限制",
        description: "最多只能上傳4張照片。"
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    
    for (const file of filesToUpload) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/heic'].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "不支援的檔案格式",
          description: "請上傳 JPG、PNG 或 HEIC 格式的照片。"
        });
        continue;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "檔案太大",
          description: "照片大小不能超過 10MB。"
        });
        continue;
      }

      setIsUploading(true);
      uploadMutation.mutate(file);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-medium mb-2">上傳照片</h2>
      <p className="text-sm text-gray-500 mb-4">請上傳與檢舉相關的照片，最多 4 張</p>
      
      {/* Photo Upload Area */}
      <div className="mb-6">
        {/* Upload Button */}
        <div className="mb-4">
          <label htmlFor="photo-upload" className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition duration-150">
              <div className="flex flex-col items-center justify-center py-4">
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">點擊上傳照片</span>
                <span className="text-xs text-gray-500 mt-1">或拖曳照片到此處</span>
              </div>
            </div>
            <input 
              id="photo-upload" 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handlePhotoUpload}
              disabled={isUploading || photos.length >= 4}
            />
          </label>
        </div>
        
        {/* Upload Status */}
        {isUploading && (
          <div className="text-center mb-4">
            <div className="animate-pulse text-primary">上傳中...</div>
          </div>
        )}
        
        {/* Photo Preview Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={photo.url} 
                  alt={`檢舉照片預覽 ${index + 1}`} 
                  className="w-full h-full object-cover rounded-lg" 
                />
                <button 
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
