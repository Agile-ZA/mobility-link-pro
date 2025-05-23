
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleBasicInfoProps {
  formData: {
    registration_number: string;
    make: string;
    model: string;
    year: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const VehicleBasicInfo = ({ formData, onInputChange }: VehicleBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="registration_number">Registration Number</Label>
        <Input
          id="registration_number"
          value={formData.registration_number}
          onChange={(e) => onInputChange('registration_number', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="make">Make</Label>
        <Input
          id="make"
          value={formData.make}
          onChange={(e) => onInputChange('make', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onInputChange('model', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => onInputChange('year', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Vehicle Type</Label>
        <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="truck">Commercial Truck</SelectItem>
            <SelectItem value="forklift">Industrial Forklift</SelectItem>
            <SelectItem value="car">Executive Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default VehicleBasicInfo;
