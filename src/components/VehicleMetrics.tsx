
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleMetricsProps {
  formData: {
    mileage: string;
    operating_hours: string;
    fuel_level: string;
    battery_level: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const VehicleMetrics = ({ formData, onInputChange }: VehicleMetricsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mileage">Mileage (optional)</Label>
        <Input
          id="mileage"
          type="number"
          value={formData.mileage}
          onChange={(e) => onInputChange('mileage', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="operating_hours">Operating Hours (optional)</Label>
        <Input
          id="operating_hours"
          type="number"
          value={formData.operating_hours}
          onChange={(e) => onInputChange('operating_hours', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fuel_level">Fuel Level % (optional)</Label>
        <Input
          id="fuel_level"
          type="number"
          min="0"
          max="100"
          value={formData.fuel_level}
          onChange={(e) => onInputChange('fuel_level', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="battery_level">Battery Level % (optional)</Label>
        <Input
          id="battery_level"
          type="number"
          min="0"
          max="100"
          value={formData.battery_level}
          onChange={(e) => onInputChange('battery_level', e.target.value)}
        />
      </div>
    </>
  );
};

export default VehicleMetrics;
