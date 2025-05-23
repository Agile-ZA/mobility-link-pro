import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspectionForm from "./InspectionForm";
import MaintenanceForm from "./MaintenanceForm";
import ReadingsForm from "./ReadingsForm";
import VehicleBooking from "./VehicleBooking";
import VehicleEditForm from "./VehicleEditForm";
import { useUserRole } from "@/hooks/useUserRole";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleDetail = ({ vehicle, onBack }: VehicleDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isFleetAdmin, loading } = useUserRole();

  console.log("User role check:", { isFleetAdmin, loading }); // Debug log

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

  const getStatusBadgeClass = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'booked':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'maintenance':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'damaged':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'Available for Use';
      case 'booked':
        return 'Currently Booked';
      case 'maintenance':
        return 'Maintenance Required';
      case 'damaged':
        return 'Damaged - Out of Service';
      default:
        return 'Unknown Status';
    }
  };

  const getImageUrl = (originalUrl: string) => {
    if (originalUrl && originalUrl.includes('unsplash.com')) {
      return originalUrl;
    }
    return originalUrl || `https://via.placeholder.com/600x400/e2e8f0/475569?text=${encodeURIComponent(vehicle.type.toUpperCase())}`;
  };

  const handleVehicleUpdated = () => {
    // Refresh the page or refetch data
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-slate-300 hover:bg-slate-50 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </Button>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{vehicle.registration_number}</h1>
              <p className="text-slate-600 text-lg">{vehicle.make} {vehicle.model} • {vehicle.year}</p>
              <p className="text-slate-500 text-sm">{getVehicleTypeLabel(vehicle.type)}</p>
            </div>
            <Badge 
              className={`text-base px-4 py-2 ${getStatusBadgeClass(vehicle.status)}`}
            >
              {getStatusLabel(vehicle.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
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
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Vehicle Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab("booking")}
                      className="h-24 flex flex-col items-center justify-center space-y-3 bg-slate-900 hover:bg-slate-800"
                    >
                      <span className="text-3xl">🔑</span>
                      <div className="text-center">
                        <div className="font-semibold">Book/Return Vehicle</div>
                        <div className="text-xs opacity-90">Manage vehicle usage</div>
                      </div>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("inspection")}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center space-y-3 border-slate-300 hover:bg-slate-50"
                    >
                      <span className="text-3xl">📋</span>
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
            </TabsContent>

            <TabsContent value="booking" className="mt-6">
              <VehicleBooking vehicle={vehicle} />
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
