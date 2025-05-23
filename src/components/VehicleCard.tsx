
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
        return 'Commercial Truck';
      case 'forklift':
        return 'Industrial Forklift';
      case 'car':
        return 'Executive Vehicle';
      default:
        return 'Fleet Vehicle';
    }
  };

  // Use a more reliable placeholder service that works better
  const getImageUrl = (originalUrl: string) => {
    if (originalUrl.includes('unsplash.com')) {
      // Extract image ID from Unsplash URL and use a more direct format
      const imageId = originalUrl.split('photo-')[1]?.split('?')[0];
      if (imageId) {
        return `https://images.unsplash.com/photo-${imageId}?w=400&h=240&fit=crop&auto=format`;
      }
    }
    // Fallback to a solid corporate placeholder
    return `https://via.placeholder.com/400x240/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-slate-200/50 border-slate-200 bg-white overflow-hidden group"
      onClick={onSelect}
    >
      <div className="aspect-[5/3] relative overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(vehicle.imageUrl)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/400x240/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant={vehicle.isAvailable ? "default" : "destructive"}
            className={vehicle.isAvailable ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {vehicle.isAvailable ? "Available" : "In Use"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm">
            {getVehicleTypeIcon(vehicle.type)} {getVehicleTypeLabel(vehicle.type)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 leading-tight">
                {vehicle.registrationNumber}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {vehicle.make} {vehicle.model} • {vehicle.year}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">📍</span>
              <span className="truncate">{vehicle.location}</span>
            </div>
            {vehicle.mileage && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">🚗</span>
                <span>{vehicle.mileage.toLocaleString()} mi</span>
              </div>
            )}
            {vehicle.operatingHours && (
              <div className="flex items-center space-x-2 sm:col-span-2">
                <span className="text-slate-400">⏰</span>
                <span>{vehicle.operatingHours.toLocaleString()} operating hours</span>
              </div>
            )}
          </div>
          
          {(vehicle.fuelLevel || vehicle.batteryLevel) && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {vehicle.fuelLevel && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">⛽</span>
                    <span className="text-slate-600">Fuel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-slate-700 font-medium w-10">{vehicle.fuelLevel}%</span>
                  </div>
                </div>
              )}
              {vehicle.batteryLevel && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">🔋</span>
                    <span className="text-slate-600">Battery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${vehicle.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-slate-700 font-medium w-10">{vehicle.batteryLevel}%</span>
                  </div>
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
