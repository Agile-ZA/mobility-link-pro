
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="border-slate-300 hover:bg-slate-50 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Fleet
      </Button>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{vehicle.registration_number}</h1>
            <p className="text-slate-600 text-lg">{vehicle.make} {vehicle.model} • {vehicle.year}</p>
            <p className="text-slate-500 text-sm">{getVehicleTypeLabel(vehicle.type)}</p>
          </div>
          <Badge 
            className={`text-base px-4 py-2 ${getStatusBadgeClass(vehicle.status)}`}
          >
            {getStatusLabel(vehicle.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;
