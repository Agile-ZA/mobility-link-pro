
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface VehicleHeaderProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleHeader = ({ vehicle, onBack }: VehicleHeaderProps) => {
  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'truck':
        return 'Commercial Truck';
      case 'forklift':
        return 'Industrial Forklift';
      case 'car':
        return 'Executive Vehicle';
      default:
        return 'Fleet Vehicle';
    }
  };

  const getStatusBadgeClass = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'booked':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'maintenance':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'damaged':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'Available for Use';
      case 'booked':
        return 'Currently Booked';
      case 'maintenance':
        return 'Maintenance Required';
      case 'damaged':
        return 'Damaged - Out of Service';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-slate-300 hover:bg-slate-50 flex items-center gap-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </Button>
        <Badge 
          className={`text-sm px-3 py-1 ${getStatusBadgeClass(vehicle.status)}`}
        >
          {getStatusLabel(vehicle.status)}
        </Badge>
      </div>
      
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{vehicle.registration_number}</h1>
          <p className="text-slate-600">{vehicle.make} {vehicle.model} • {vehicle.year} • {getVehicleTypeLabel(vehicle.type)}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;
