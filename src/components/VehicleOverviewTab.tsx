
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Book, Wrench } from "lucide-react";

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
    <div className="space-y-4">
      {/* Vehicle Image Section */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/5fcb470f-dbe9-462f-9cc3-5d929e79425f.png" 
              alt="Vehicle"
              className="w-48 h-32 object-cover rounded-lg border border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
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
              onClick={() => setActiveTab("inspection")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-1 border-slate-300 hover:bg-slate-50"
            >
              <Book className="w-5 h-5" />
              <span className="text-sm">Vehicle Inspection</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveTab("maintenance")}
              className="h-16 flex flex-col items-center justify-center gap-1 border-slate-300 hover:bg-slate-50"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-sm">Maintenance Request</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleOverviewTab;
