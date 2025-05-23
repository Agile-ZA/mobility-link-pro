
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleImageSectionProps {
  formData: {
    image_url: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const VehicleImageSection = ({ formData, onInputChange }: VehicleImageSectionProps) => {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="image_url">Image URL (optional)</Label>
      <Input
        id="image_url"
        type="url"
        value={formData.image_url}
        onChange={(e) => onInputChange('image_url', e.target.value)}
        placeholder="https://example.com/vehicle-image.jpg"
      />
    </div>
  );
};

export default VehicleImageSection;
