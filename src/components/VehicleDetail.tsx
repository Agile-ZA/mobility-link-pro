
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspectionForm from "./InspectionForm";
import MaintenanceForm from "./MaintenanceForm";
import ReadingsForm from "./ReadingsForm";

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleDetail = ({ vehicle, onBack }: VehicleDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'truck':
        return 'Truck';
      case 'forklift':
        return 'Forklift';
      case 'car':
        return 'Car';
      default:
        return 'Vehicle';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Fleet
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{vehicle.registrationNumber}</h1>
          <p className="text-gray-600">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <Badge variant={vehicle.isAvailable ? "default" : "destructive"}>
                    {vehicle.isAvailable ? "Available" : "In Use"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span>{getVehicleTypeLabel(vehicle.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span>{vehicle.location}</span>
                  </div>
                  {vehicle.mileage && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mileage</span>
                      <span>{vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                  )}
                  {vehicle.operatingHours && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Operating Hours</span>
                      <span>{vehicle.operatingHours.toLocaleString()} hrs</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Inspection</span>
                    <span>{new Date(vehicle.lastInspection).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Maintenance</span>
                    <span>{new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>

                {(vehicle.fuelLevel || vehicle.batteryLevel) && (
                  <div className="space-y-3 pt-2 border-t">
                    {vehicle.fuelLevel && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Fuel Level</span>
                          <span>{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {vehicle.batteryLevel && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Battery Level</span>
                          <span>{vehicle.batteryLevel}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${vehicle.batteryLevel}%` }}
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

        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab("inspection")}
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <span className="text-2xl">📋</span>
                      <span>Inspect Vehicle</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("maintenance")}
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <span className="text-2xl">🔧</span>
                      <span>Maintenance Request</span>
                    </Button>
                    <ReadingsForm vehicle={vehicle} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inspection">
              <InspectionForm vehicle={vehicle} />
            </TabsContent>
            
            <TabsContent value="maintenance">
              <MaintenanceForm vehicle={vehicle} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
