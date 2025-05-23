
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
      <CardHeader className="py-4">
        <CardTitle className="text-slate-900 text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            onClick={() => setActiveTab("booking")}
            className={`h-16 flex flex-col items-center justify-center ${bookingButtonColor}`}
          >
            <Car className="w-5 h-5 mb-1" />
            <span>{bookingButtonText}</span>
          </Button>
          <Button 
            onClick={() => setActiveTab("inspection")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center border-slate-300 hover:bg-slate-50"
          >
            <Book className="w-5 h-5 mb-1" />
            <span>Vehicle Inspection</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setActiveTab("maintenance")}
            className="h-16 flex flex-col items-center justify-center border-slate-300 hover:bg-slate-50"
          >
            <span className="text-2xl mb-1">🔧</span>
            <span>Maintenance Request</span>
          </Button>
        </div>
        
        {isFleetAdmin && (
          <div className="mt-4 pt-4 border-t border-slate-200">
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
