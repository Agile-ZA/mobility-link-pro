
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VehicleStatusBadge from "./booking/VehicleStatusBadge";
import { MapPin } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, onSelect }: VehicleCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 cursor-pointer"
      onClick={onSelect}
    >
      <div className="aspect-[16/9] relative bg-slate-100">
        {vehicle.image_url ? (
          <img 
            src={vehicle.image_url} 
            alt={`${vehicle.make} ${vehicle.model}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-4xl">🚗</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {vehicle.registration_number}
              </h3>
              <p className="text-sm text-slate-600">
                {vehicle.make} {vehicle.model} • {vehicle.year}
              </p>
            </div>
            <Badge className="bg-slate-100 text-slate-900 hover:bg-slate-200 border-0">
              {vehicle.type === 'truck' ? 'Truck' : vehicle.type === 'forklift' ? 'Forklift' : 'Car'}
            </Badge>
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-4 gap-1">
            <MapPin className="w-3 h-3" />
            {vehicle.site?.name ? vehicle.site.name : vehicle.location}
          </div>

          {vehicle.current_user_id && vehicle.profile && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-700 mr-2">
                {vehicle.profile.full_name.charAt(0)}
              </div>
              <div className="text-xs text-slate-600 truncate">
                Assigned to: {vehicle.profile.full_name}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
