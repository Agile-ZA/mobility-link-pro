
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

interface ReturnVehicleFormProps {
  vehicle: Vehicle;
  onVehicleUpdate?: () => void;
  onCancel: () => void;
}

const ReturnVehicleForm = ({ vehicle, onVehicleUpdate, onCancel }: ReturnVehicleFormProps) => {
  const [odometer, setOdometer] = useState(vehicle.mileage?.toString() || "");
  const [operatingHours, setOperatingHours] = useState(vehicle.operating_hours?.toString() || "");
  const [comments, setComments] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { returnVehicle } = useVehicles();
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleReturnVehicle = async () => {
    if (!odometer.trim()) {
      toast({
        title: "Odometer Reading Required",
        description: "Please provide the current odometer reading.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const updates: { mileage?: number; operating_hours?: number } = {};
    
    if (odometer) updates.mileage = parseInt(odometer);
    if (operatingHours) updates.operating_hours = parseInt(operatingHours);

    const result = await returnVehicle(vehicle.id, updates);
    
    if (result.success) {
      toast({
        title: "Vehicle Returned Successfully",
        description: `${vehicle.registration_number} has been returned and is now available.`,
      });
      
      // Reset form
      onCancel();
      
      // Trigger page update
      if (onVehicleUpdate) {
        onVehicleUpdate();
      } else {
        window.location.reload();
      }
    } else {
      toast({
        title: "Return Failed",
        description: "Failed to return the vehicle. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4">
      <h4 className="font-medium text-slate-900">Vehicle Return Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="odometer" className="text-slate-700 font-medium">
            Odometer Reading *
          </Label>
          <Input
            id="odometer"
            type="number"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            placeholder="Current mileage"
            className="border-slate-300 focus:border-slate-500"
            required
          />
        </div>

        {vehicle.type === 'forklift' && (
          <div className="space-y-2">
            <Label htmlFor="operatingHours" className="text-slate-700 font-medium">
              Operating Hours
            </Label>
            <Input
              id="operatingHours"
              type="number"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              placeholder="Current operating hours"
              className="border-slate-300 focus:border-slate-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="returnImage" className="text-slate-700 font-medium flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Return Photo (Optional)
        </Label>
        <Input
          id="returnImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border-slate-300"
        />
        {imageFile && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Image selected: {imageFile.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="returnComments" className="text-slate-700 font-medium">
          Return Comments (Optional)
        </Label>
        <Textarea
          id="returnComments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Any issues, damage, or observations..."
          rows={3}
          className="border-slate-300 focus:border-slate-500 resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleReturnVehicle}
          className="flex-1 bg-slate-900 hover:bg-slate-800"
          disabled={isLoading}
        >
          {isLoading ? 'Returning...' : 'Confirm Return'}
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-slate-300 hover:bg-slate-50"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ReturnVehicleForm;
