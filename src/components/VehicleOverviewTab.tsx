
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Book } from "lucide-react";

interface VehicleOverviewTabProps {
  isFleetAdmin: boolean;
  setActiveTab: (tab: string) => void;
  vehicleStatus?: 'available' | 'booked' | 'maintenance' | 'damaged';
}

const VehicleOverviewTab = ({ isFleetAdmin, setActiveTab, vehicleStatus }: VehicleOverviewTabProps) => {
  const isBooked = vehicleStatus === 'booked';
  const bookingButtonText = isBooked ? 'Return Vehicle' : 'Book Vehicle';
  const bookingButtonColor = isBooked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Vehicle Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setActiveTab("booking")}
            className={`h-24 flex flex-col items-center justify-center space-y-3 ${bookingButtonColor}`}
          >
            <Car className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">{bookingButtonText}</div>
              <div className="text-xs opacity-90">Manage vehicle usage</div>
            </div>
          </Button>
          <Button 
            onClick={() => setActiveTab("inspection")}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-3 border-slate-300 hover:bg-slate-50"
          >
            <Book className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">Vehicle Inspection</div>
              <div className="text-xs text-slate-600">Capture condition & location</div>
            </div>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setActiveTab("maintenance")}
            className="h-24 flex flex-col items-center justify-center space-y-3 border-slate-300 hover:bg-slate-50"
          >
            <span className="text-3xl">🔧</span>
            <div className="text-center">
              <div className="font-semibold">Maintenance Request</div>
              <div className="text-xs text-slate-600">Schedule service</div>
            </div>
          </Button>
        </div>
        
        {isFleetAdmin && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <Button 
                onClick={() => setActiveTab("admin")}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <span className="text-xl mr-2">⚙️</span>
                Admin Controls
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleOverviewTab;
