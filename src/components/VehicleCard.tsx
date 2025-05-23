
import { Vehicle } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, onSelect }: VehicleCardProps) => {
  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'truck':
        return '🚛';
      case 'forklift':
        return '🏗️';
      case 'car':
        return '🚗';
      default:
        return '🚛';
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'truck':
        return 'Truck';
      case 'forklift':
        return 'Forklift';
      case 'car':
        return 'Car';
      default:
        return 'Vehicle';
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 overflow-hidden"
      onClick={onSelect}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={vehicle.isAvailable ? "default" : "destructive"}>
            {vehicle.isAvailable ? "Available" : "In Use"}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-medium">
            {getVehicleTypeIcon(vehicle.type)} {getVehicleTypeLabel(vehicle.type)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900">
              {vehicle.registrationNumber}
            </h3>
          </div>
          
          <p className="text-gray-600">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>📍 {vehicle.location}</span>
            {vehicle.mileage && (
              <span>🚗 {vehicle.mileage.toLocaleString()} mi</span>
            )}
            {vehicle.operatingHours && (
              <span>⏰ {vehicle.operatingHours.toLocaleString()} hrs</span>
            )}
          </div>
          
          {(vehicle.fuelLevel || vehicle.batteryLevel) && (
            <div className="pt-2">
              {vehicle.fuelLevel && (
                <div className="flex items-center gap-2 text-sm">
                  <span>⛽</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                  <span>{vehicle.fuelLevel}%</span>
                </div>
              )}
              {vehicle.batteryLevel && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span>🔋</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${vehicle.batteryLevel}%` }}
                    />
                  </div>
                  <span>{vehicle.batteryLevel}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
