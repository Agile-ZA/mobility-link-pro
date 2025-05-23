
import { Calendar, User } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReturnVehicleForm from "./ReturnVehicleForm";

interface CurrentBookingInfoProps {
  vehicle: Vehicle;
  isUserVehicle: boolean;
  onVehicleUpdate?: () => void;
}

const CurrentBookingInfo = ({ vehicle, isUserVehicle, onVehicleUpdate }: CurrentBookingInfoProps) => {
  const [showReturnForm, setShowReturnForm] = useState(false);

  if (isUserVehicle) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Currently Assigned to You</span>
          </div>
          {vehicle.booked_at && (
            <p className="text-blue-700 text-sm flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4" />
              Booked: {new Date(vehicle.booked_at).toLocaleString()}
            </p>
          )}
        </div>

        {!showReturnForm ? (
          <Button 
            onClick={() => setShowReturnForm(true)}
            variant="outline"
            className="w-full border-slate-300 hover:bg-slate-50"
          >
            Return Vehicle
          </Button>
        ) : (
          <ReturnVehicleForm 
            vehicle={vehicle} 
            onVehicleUpdate={onVehicleUpdate} 
            onCancel={() => setShowReturnForm(false)} 
          />
        )}
      </div>
    );
  }

  // For other users viewing a booked vehicle
  if (vehicle.profile) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Currently Booked</span>
        </div>
        <p className="text-blue-800">
          <strong>User:</strong> {vehicle.profile.full_name}
        </p>
        {vehicle.booked_at && (
          <p className="text-blue-700 text-sm flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            Booked: {new Date(vehicle.booked_at).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default CurrentBookingInfo;
