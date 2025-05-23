
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Book, Wrench } from "lucide-react";

interface VehicleOverviewTabProps {
  isFleetAdmin: boolean;
  setActiveTab: (tab: string) => void;
  vehicleStatus?: 'available' | 'booked' | 'maintenance' | 'damaged';
  onInspectionClick: () => void;
  onMaintenanceClick: () => void;
}

const VehicleOverviewTab = ({ isFleetAdmin, setActiveTab, vehicleStatus, onInspectionClick, onMaintenanceClick }: VehicleOverviewTabProps) => {
  const isBooked = vehicleStatus === 'booked';
  const bookingButtonText = isBooked ? 'Return Vehicle' : 'Book Vehicle';
  const bookingButtonColor = isBooked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <Card className="border-slate-200">
      <CardHeader className="py-4">
        <CardTitle className="text-slate-900 text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            onClick={() => setActiveTab("booking")}
            className={`h-16 flex flex-col items-center justify-center gap-1 ${bookingButtonColor}`}
          >
            <Car className="w-5 h-5" />
            <span className="text-sm">{bookingButtonText}</span>
          </Button>
          <Button 
            onClick={onInspectionClick}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-1 border-slate-300 hover:bg-slate-50"
          >
            <Book className="w-5 h-5" />
            <span className="text-sm">Vehicle Inspection</span>
          </Button>
          <Button 
            variant="outline"
            onClick={onMaintenanceClick}
            className="h-16 flex flex-col items-center justify-center gap-1 border-slate-300 hover:bg-slate-50"
          >
            <Wrench className="w-5 h-5" />
            <span className="text-sm">Maintenance Request</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleOverviewTab;
