
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
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-slate-900">Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-y divide-slate-100">
          <div className="p-4 border-r border-slate-100">
            <p className="text-sm font-medium text-slate-500">Registration</p>
            <p className="mt-1 font-medium">{vehicle.registration_number}</p>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-500">Type</p>
            <p className="mt-1 capitalize">
              {vehicle.type === 'truck' ? 'Commercial Truck' : 
               vehicle.type === 'forklift' ? 'Industrial Forklift' : 
               'Executive Vehicle'}
            </p>
          </div>
          <div className="p-4 border-r border-slate-100">
            <p className="text-sm font-medium text-slate-500">Make</p>
            <p className="mt-1">{vehicle.make}</p>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-500">Model</p>
            <p className="mt-1">{vehicle.model}</p>
          </div>
          <div className="p-4 border-r border-slate-100">
            <p className="text-sm font-medium text-slate-500">Year</p>
            <p className="mt-1">{vehicle.year}</p>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-slate-500">
              {vehicle.type === 'forklift' ? 'Operating Hours' : 'Mileage'}
            </p>
            <p className="mt-1">
              {vehicle.type === 'forklift' 
                ? vehicle.operating_hours ? `${vehicle.operating_hours} hrs` : 'N/A'
                : vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}
            </p>
          </div>
          <div className="p-4 border-r border-slate-100 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Site</p>
              <p className="mt-1">{vehicle.site?.name || 'Unassigned'}</p>
            </div>
          </div>
          <div className="p-4 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Location</p>
              <p className="mt-1">{vehicle.site?.location || vehicle.location}</p>
            </div>
          </div>
          <div className="p-4 border-r border-slate-100 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Last Inspection</p>
              <p className="mt-1">{new Date(vehicle.last_inspection).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="p-4 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Next Maintenance</p>
              <p className="mt-1">{new Date(vehicle.next_maintenance).toLocaleDateString()}</p>
            </div>
          </div>
          {vehicle.booked_at && (
            <div className="p-4 col-span-2 flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Booked Since</p>
                <p className="mt-1">
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
