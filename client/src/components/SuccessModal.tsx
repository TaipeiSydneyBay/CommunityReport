import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
}

export function SuccessModal({ isOpen, onClose, reportId }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg p-6 max-w-sm mx-4 md:mx-0">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="mt-4 text-lg font-medium text-gray-900">
            回報改善提交成功
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            感謝您的回報，社區管理人員將會盡快處理您的改善建議。案件編號：
            <span className="font-medium">{reportId}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button 
            className="w-full bg-primary text-white font-medium"
            onClick={onClose}
          >
            返回
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
