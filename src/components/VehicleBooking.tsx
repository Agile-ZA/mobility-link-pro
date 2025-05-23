
import { Vehicle } from "@/types/vehicle";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import BookVehicleSection from "./booking/BookVehicleSection";
import CurrentBookingInfo from "./booking/CurrentBookingInfo";
import UnavailableVehicleMessage from "./booking/UnavailableVehicleMessage";
import { getStatusBadgeColor } from "./booking/VehicleStatusBadge";

interface VehicleBookingProps {
  vehicle: Vehicle;
  onVehicleUpdate?: () => void;
}

const VehicleBooking = ({ vehicle, onVehicleUpdate }: VehicleBookingProps) => {
  const { user } = useAuth();
  const isUserVehicle = vehicle.current_user_id === user?.id;

  if (vehicle.status === 'maintenance' || vehicle.status === 'damaged') {
    return <UnavailableVehicleMessage status={vehicle.status} />;
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className={`w-8 h-8 ${getStatusBadgeColor(vehicle.status)} rounded-lg flex items-center justify-center`}>
            <User className="w-4 h-4 text-white" />
          </div>
          Vehicle Booking & Return
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {vehicle.status === 'available' && user && (
          <BookVehicleSection 
            vehicle={vehicle} 
            userId={user.id} 
            onVehicleUpdate={onVehicleUpdate} 
          />
        )}

        {vehicle.status === 'booked' && (
          <CurrentBookingInfo 
            vehicle={vehicle} 
            isUserVehicle={isUserVehicle} 
            onVehicleUpdate={onVehicleUpdate} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleBooking;
