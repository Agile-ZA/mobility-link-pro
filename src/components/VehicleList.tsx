
import { useState, useMemo } from "react";
import { Vehicle } from "@/types/vehicle";
import VehicleCard from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - in real app this would come from SAP API
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "FL-001-TX",
    type: "truck",
    make: "Ford",
    model: "F-150",
    year: 2022,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    mileage: 45000,
    location: "Main Depot",
    lastInspection: "2024-05-15",
    nextMaintenance: "2024-06-15",
    fuelLevel: 75
  },
  {
    id: "2",
    registrationNumber: "FK-002-TX",
    type: "forklift",
    make: "Toyota",
    model: "8FGU25",
    year: 2021,
    isAvailable: false,
    imageUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=400&h=300&fit=crop",
    operatingHours: 2500,
    location: "Warehouse A",
    lastInspection: "2024-05-10",
    nextMaintenance: "2024-06-10",
    batteryLevel: 85
  },
  {
    id: "3",
    registrationNumber: "PC-003-TX",
    type: "car",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    mileage: 12000,
    location: "Executive Parking",
    lastInspection: "2024-05-20",
    nextMaintenance: "2024-07-20",
    fuelLevel: 60
  },
  {
    id: "4",
    registrationNumber: "FL-004-TX",
    type: "truck",
    make: "Chevrolet",
    model: "Silverado",
    year: 2021,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    mileage: 67000,
    location: "North Depot",
    lastInspection: "2024-05-18",
    nextMaintenance: "2024-06-18",
    fuelLevel: 40
  }
];

interface VehicleListProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const VehicleList = ({ onVehicleSelect }: VehicleListProps) => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter(vehicle => {
      const typeMatch = selectedType === "all" || vehicle.type === selectedType;
      const availabilityMatch = !showAvailableOnly || vehicle.isAvailable;
      return typeMatch && availabilityMatch;
    });
  }, [selectedType, showAvailableOnly]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vehicle Fleet</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your corporate vehicles</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="truck">Trucks</SelectItem>
              <SelectItem value="forklift">Forklifts</SelectItem>
              <SelectItem value="car">Cars</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className="w-full sm:w-auto"
          >
            {showAvailableOnly ? "Show All" : "Available Only"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={() => onVehicleSelect(vehicle)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
