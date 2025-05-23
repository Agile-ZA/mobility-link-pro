import { Vehicle } from "@/hooks/useVehicles";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, onSelect }: VehicleCardProps) => {
  const { user } = useAuth();
  
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

  const getStatusBadgeVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'booked':
        return 'secondary';
      case 'maintenance':
        return 'outline';
      case 'damaged':
        return 'destructive';
      default:
        return 'outline';
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

  const isUserVehicle = vehicle.current_user_id === user?.id;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-slate-200/50 border-slate-200 bg-white overflow-hidden group ${
        isUserVehicle ? 'ring-2 ring-blue-500 border-blue-200' : ''
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[5/3] relative overflow-hidden bg-slate-100">
        <img
          src={vehicle.image_url || `https://via.placeholder.com/400x240/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/400x240/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <Badge 
            className={getStatusBadgeClass(vehicle.status)}
          >
            {getStatusLabel(vehicle.status)}
          </Badge>
        </div>
        {isUserVehicle && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600 text-white">
              Your Vehicle
            </Badge>
          </div>
        )}
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
                {vehicle.registration_number}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {vehicle.make} {vehicle.model} • {vehicle.year}
              </p>
            </div>
          </div>

          {vehicle.status === 'booked' && vehicle.profile && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-900 text-sm font-medium">
                👤 {vehicle.profile.full_name}
              </p>
              {vehicle.booked_at && (
                <p className="text-blue-700 text-xs mt-1">
                  Booked: {new Date(vehicle.booked_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
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
            {vehicle.operating_hours && (
              <div className="flex items-center space-x-2 sm:col-span-2">
                <span className="text-slate-400">⏰</span>
                <span>{vehicle.operating_hours.toLocaleString()} operating hours</span>
              </div>
            )}
          </div>
          
          {(vehicle.fuel_level || vehicle.battery_level) && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {vehicle.fuel_level && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">⛽</span>
                    <span className="text-slate-600">Fuel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${vehicle.fuel_level}%` }}
                      />
                    </div>
                    <span className="text-slate-700 font-medium w-10">{vehicle.fuel_level}%</span>
                  </div>
                </div>
              )}
              {vehicle.battery_level && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">🔋</span>
                    <span className="text-slate-600">Battery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${vehicle.battery_level}%` }}
                      />
                    </div>
                    <span className="text-slate-700 font-medium w-10">{vehicle.battery_level}%</span>
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
