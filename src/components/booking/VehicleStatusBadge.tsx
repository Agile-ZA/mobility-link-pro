
import { Vehicle } from "@/types/vehicle";

interface VehicleStatusBadgeProps {
  status: Vehicle['status'];
}

export const getStatusBadgeColor = (status: Vehicle['status']) => {
  switch (status) {
    case 'available':
      return 'bg-green-600 hover:bg-green-700';
    case 'booked':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'maintenance':
      return 'bg-amber-600 hover:bg-amber-700';
    case 'damaged':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-slate-600 hover:bg-slate-700';
  }
};

export const getStatusLabel = (status: Vehicle['status']) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'booked':
      return 'Booked';
    case 'maintenance':
      return 'Maintenance Required';
    case 'damaged':
      return 'Damaged';
    default:
      return 'Unknown';
  }
};

export const getStatusBadgeText = (status: Vehicle['status']) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'booked':
      return 'Booked';
    case 'maintenance':
      return 'Maintenance';
    case 'damaged':
      return 'Damaged';
    default:
      return 'Unknown';
  }
};

const VehicleStatusBadge = ({ status }: VehicleStatusBadgeProps) => {
  return (
    <div className={`px-2 py-1 ${getStatusBadgeColor(status)} rounded-md flex items-center justify-center min-w-[70px]`}>
      <span className="text-white text-xs font-semibold">{getStatusBadgeText(status)}</span>
    </div>
  );
};

export default VehicleStatusBadge;
