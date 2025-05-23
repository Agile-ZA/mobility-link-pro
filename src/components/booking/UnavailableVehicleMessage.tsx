
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleStatusBadge, { getStatusBadgeColor, getStatusLabel } from "./VehicleStatusBadge";

interface UnavailableVehicleMessageProps {
  status: Vehicle['status'];
}

const UnavailableVehicleMessage = ({ status }: UnavailableVehicleMessageProps) => {
  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <VehicleStatusBadge status={status} />
          Vehicle Status: {getStatusLabel(status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-slate-600">
          This vehicle is currently unavailable due to {status === 'maintenance' ? 'required maintenance' : 'damage'}.
          Please contact the fleet manager for more information.
        </p>
      </CardContent>
    </Card>
  );
};

export default UnavailableVehicleMessage;
