
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleInfoCardProps {
  vehicle: Vehicle;
}

const VehicleInfoCard = ({ vehicle }: VehicleInfoCardProps) => {
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

  const getImageUrl = (originalUrl: string) => {
    if (originalUrl && originalUrl.includes('unsplash.com')) {
      return originalUrl;
    }
    return originalUrl || `https://via.placeholder.com/600x400/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={getImageUrl(vehicle.image_url)}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/600x400/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
            }}
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Vehicle Type</span>
              <span className="text-slate-900">{getVehicleTypeLabel(vehicle.type)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Current Location</span>
              <span className="text-slate-900 text-right">{vehicle.location}</span>
            </div>
            {vehicle.mileage && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Total Mileage</span>
                <span className="text-slate-900">{vehicle.mileage.toLocaleString()} mi</span>
              </div>
            )}
            {vehicle.operating_hours && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Operating Hours</span>
                <span className="text-slate-900">{vehicle.operating_hours.toLocaleString()} hrs</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Last Inspection</span>
              <span className="text-slate-900">{new Date(vehicle.last_inspection).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">Next Maintenance</span>
              <span className="text-slate-900">{new Date(vehicle.next_maintenance).toLocaleDateString()}</span>
            </div>
          </div>

          {(vehicle.fuel_level || vehicle.battery_level) && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-medium text-slate-900">System Status</h4>
              {vehicle.fuel_level && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Fuel Level</span>
                    <span className="text-slate-900 font-medium">{vehicle.fuel_level}%</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${vehicle.fuel_level}%` }}
                    />
                  </div>
                </div>
              )}
              {vehicle.battery_level && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Battery Level</span>
                    <span className="text-slate-900 font-medium">{vehicle.battery_level}%</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${vehicle.battery_level}%` }}
                    />
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

export default VehicleInfoCard;
