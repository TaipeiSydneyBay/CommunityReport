import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface DescriptionSectionProps {
  description: string;
  setDescription: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
}

export function DescriptionSection({
  description,
  setDescription,
  contact,
  setContact
}: DescriptionSectionProps) {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limit to 500 characters
    if (value.length <= 500) {
      setDescription(value);
    }
  };

  return (
    <section className="px-4 py-2 border-t border-gray-100">
      <h2 className="text-lg font-medium mb-4">問題描述</h2>
      
      <div className="mb-1">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
          詳細說明 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          rows={5}
          className="block w-full rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="請詳細描述問題情況，包括事件發生的時間、地點和具體情況..."
          maxLength={500}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{description.length}/500</span>
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="contact" className="text-sm font-medium text-gray-700 mb-1">
          聯絡方式（選填）
        </Label>
        <Input
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="請留下您的聯絡方式，以便我們跟進（選填）"
        />
      </div>
    </section>
  );
}
