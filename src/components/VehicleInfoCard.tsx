
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { MapPin, Calendar, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

interface VehicleInfoCardProps {
  vehicle: Vehicle;
}

const VehicleInfoCard = ({ vehicle }: VehicleInfoCardProps) => {
  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
        <CardTitle className="text-slate-900 text-lg">Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Vehicle Image Section */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-center">
            <img 
              src={vehicle.image_url || "/lovable-uploads/5fcb470f-dbe9-462f-9cc3-5d929e79425f.png"} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-48 h-32 object-cover rounded-lg border border-slate-200"
            />
          </div>
        </div>
        
        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-slate-100">
          <div className="p-3 border-r border-slate-100">
            <p className="text-xs font-medium text-slate-500">Registration</p>
            <p className="mt-0.5 font-medium">{vehicle.registration_number}</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-xs font-medium text-slate-500">Make / Model</p>
            <p className="mt-0.5">{vehicle.make} {vehicle.model}</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-xs font-medium text-slate-500">Year</p>
            <p className="mt-0.5">{vehicle.year}</p>
          </div>
          <div className="p-3">
            <p className="text-xs font-medium text-slate-500">Type</p>
            <p className="mt-0.5 capitalize">
              {vehicle.type === 'truck' ? 'Commercial Truck' : 
               vehicle.type === 'forklift' ? 'Industrial Forklift' : 
               'Executive Vehicle'}
            </p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-xs font-medium text-slate-500">
              {vehicle.type === 'forklift' ? 'Operating Hours' : 'Mileage'}
            </p>
            <p className="mt-0.5">
              {vehicle.type === 'forklift' 
                ? vehicle.operating_hours ? `${vehicle.operating_hours} hrs` : 'N/A'
                : vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}
            </p>
          </div>
          <div className="p-3 flex items-start gap-1.5 border-r border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-500">Site</p>
              <p className="mt-0.5 text-sm">{vehicle.site?.name || 'Unassigned'}</p>
            </div>
          </div>
          <div className="p-3 flex items-start gap-1.5 border-r border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-500">Last Inspection</p>
              <p className="mt-0.5 text-sm">{new Date(vehicle.last_inspection).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="p-3 flex items-start gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-500">Next Maintenance</p>
              <p className="mt-0.5 text-sm">{new Date(vehicle.next_maintenance).toLocaleDateString()}</p>
            </div>
          </div>
          {vehicle.booked_at && (
            <div className="p-3 col-span-2 sm:col-span-4 flex items-start gap-1.5 border-t border-slate-100">
              <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500">Booked Since</p>
                <p className="mt-0.5 text-sm">
                  {format(parseISO(vehicle.booked_at), 'PPP')} ({format(parseISO(vehicle.booked_at), 'pp')})
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
