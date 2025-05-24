
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleHeader from "./VehicleHeader";
import VehicleInfoCard from "./VehicleInfoCard";
import VehicleOverviewTab from "./VehicleOverviewTab";
import VehicleBooking from "./VehicleBooking";
import BookingHistoryTable from "./BookingHistoryTable";
import InspectionForm from "./InspectionForm";
import MaintenanceForm from "./MaintenanceForm";
import { useUserRole } from "@/hooks/useUserRole";
import { useBookingHistory } from "@/hooks/useBookingHistory";
import { useState } from "react";

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleDetail = ({ vehicle, onBack }: VehicleDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showInspection, setShowInspection] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const { isFleetAdmin, loading } = useUserRole();
  const { bookingHistory, loading: historyLoading } = useBookingHistory(vehicle.id);

  console.log("User role check:", { isFleetAdmin, loading }); // Debug log

  const handleVehicleUpdated = () => {
    // Refresh the page to get updated vehicle data
    window.location.reload();
  };

  const handleInspectionClick = () => {
    setShowInspection(true);
  };

  const handleInspectionBack = () => {
    setShowInspection(false);
  };

  const handleMaintenanceClick = () => {
    setShowMaintenance(true);
  };

  const handleMaintenanceBack = () => {
    setShowMaintenance(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showInspection) {
    return (
      <div className="space-y-4">
        <VehicleHeader vehicle={vehicle} onBack={handleInspectionBack} />
        <InspectionForm vehicle={vehicle} onCancel={handleInspectionBack} />
      </div>
    );
  }

  if (showMaintenance) {
    return (
      <div className="space-y-4">
        <VehicleHeader vehicle={vehicle} onBack={handleMaintenanceBack} />
        <MaintenanceForm vehicle={vehicle} onCancel={handleMaintenanceBack} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VehicleHeader vehicle={vehicle} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 order-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isFleetAdmin ? 'grid-cols-3' : 'grid-cols-2'} bg-slate-100 p-1`}>
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Booking</TabsTrigger>
              {isFleetAdmin && (
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <VehicleOverviewTab 
                isFleetAdmin={isFleetAdmin} 
                setActiveTab={setActiveTab} 
                vehicleStatus={vehicle.status}
                onInspectionClick={handleInspectionClick}
                onMaintenanceClick={handleMaintenanceClick}
              />
            </TabsContent>

            <TabsContent value="booking" className="mt-4">
              <VehicleBooking 
                vehicle={vehicle} 
                onVehicleUpdate={handleVehicleUpdated} 
              />
            </TabsContent>

            {isFleetAdmin && (
              <TabsContent value="history" className="mt-4">
                <BookingHistoryTable 
                  bookingHistory={bookingHistory} 
                  loading={historyLoading}
                  showVehicleInfo={false}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="lg:col-span-3 order-2">
          <VehicleInfoCard vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
