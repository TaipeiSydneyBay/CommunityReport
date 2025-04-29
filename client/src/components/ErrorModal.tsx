import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg p-6 max-w-sm mx-4 md:mx-0">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="mt-4 text-lg font-medium text-gray-900">
            提交失敗
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            {errorMessage || "提交過程中發生錯誤，請檢查網絡連接並再試一次。"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button 
            className="w-full bg-primary text-white font-medium"
            onClick={onClose}
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
