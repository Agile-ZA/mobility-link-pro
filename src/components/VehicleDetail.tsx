
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspectionForm from "./InspectionForm";
import MaintenanceForm from "./MaintenanceForm";
import VehicleBooking from "./VehicleBooking";
import VehicleEditForm from "./VehicleEditForm";
import VehicleHeader from "./VehicleHeader";
import VehicleInfoCard from "./VehicleInfoCard";
import VehicleOverviewTab from "./VehicleOverviewTab";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleDetail = ({ vehicle, onBack }: VehicleDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isFleetAdmin, loading } = useUserRole();

  console.log("User role check:", { isFleetAdmin, loading }); // Debug log

  const handleVehicleUpdated = () => {
    // Refresh the page to get updated vehicle data
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <VehicleHeader vehicle={vehicle} onBack={onBack} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <VehicleInfoCard vehicle={vehicle} />
        </div>

        <div className="xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isFleetAdmin ? 'grid-cols-5' : 'grid-cols-4'} bg-slate-100 p-1`}>
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Booking</TabsTrigger>
              <TabsTrigger value="inspection" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Inspection</TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Maintenance</TabsTrigger>
              {isFleetAdmin && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-red-600 font-semibold">Admin</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <VehicleOverviewTab isFleetAdmin={isFleetAdmin} setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="booking" className="mt-6">
              <VehicleBooking vehicle={vehicle} onVehicleUpdate={handleVehicleUpdated} />
            </TabsContent>
            
            <TabsContent value="inspection" className="mt-6">
              <InspectionForm vehicle={vehicle} />
            </TabsContent>
            
            <TabsContent value="maintenance" className="mt-6">
              <MaintenanceForm vehicle={vehicle} />
            </TabsContent>
            
            {isFleetAdmin && (
              <TabsContent value="admin" className="mt-6">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900 flex items-center gap-2">
                      <span className="text-xl">⚙️</span>
                      Administrator Functions
                    </CardTitle>
                    <p className="text-red-700 text-sm">
                      Manage and edit vehicle details. Changes are permanent and will affect all users.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <VehicleEditForm 
                      vehicle={vehicle} 
                      onSuccess={handleVehicleUpdated}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
