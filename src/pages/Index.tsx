
import { useState } from "react";
import VehicleList from "@/components/VehicleList";
import VehicleDetail from "@/components/VehicleDetail";
import { Vehicle } from "@/types/vehicle";

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBackToList = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Fleet Manager</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Corporate Vehicle Management System
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedVehicle ? (
          <VehicleDetail 
            vehicle={selectedVehicle} 
            onBack={handleBackToList}
          />
        ) : (
          <VehicleList onVehicleSelect={handleVehicleSelect} />
        )}
      </main>
    </div>
  );
};

export default Index;
