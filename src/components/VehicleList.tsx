
import { useState, useMemo } from "react";
import { Vehicle } from "@/types/vehicle";
import VehicleCard from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Updated mock data with better image URLs
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "FL-001-TX",
    type: "truck",
    make: "Ford",
    model: "F-150",
    year: 2022,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
    mileage: 45000,
    location: "Main Distribution Center",
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
    imageUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba",
    operatingHours: 2500,
    location: "Warehouse Complex A",
    lastInspection: "2024-05-10",
    nextMaintenance: "2024-06-10",
    batteryLevel: 85
  },
  {
    id: "3",
    registrationNumber: "PC-003-TX",
    type: "car",
    make: "Toyota",
    model: "Camry Hybrid",
    year: 2023,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
    mileage: 12000,
    location: "Executive Office Complex",
    lastInspection: "2024-05-20",
    nextMaintenance: "2024-07-20",
    fuelLevel: 60
  },
  {
    id: "4",
    registrationNumber: "FL-004-TX",
    type: "truck",
    make: "Chevrolet",
    model: "Silverado 2500HD",
    year: 2021,
    isAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
    mileage: 67000,
    location: "North Distribution Hub",
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

  const stats = useMemo(() => {
    const total = mockVehicles.length;
    const available = mockVehicles.filter(v => v.isAvailable).length;
    const inUse = total - available;
    return { total, available, inUse };
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fleet Overview</h2>
          <p className="text-slate-600 mt-1">Monitor and manage your corporate vehicle fleet</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  🚗
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Available</p>
                  <p className="text-2xl font-bold text-green-700">{stats.available}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  ✅
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Use</p>
                  <p className="text-2xl font-bold text-amber-700">{stats.inUse}</p>
                </div>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  🔄
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-300">
                    <SelectValue placeholder="Filter by vehicle type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all">All Vehicle Types</SelectItem>
                    <SelectItem value="truck">Commercial Trucks</SelectItem>
                    <SelectItem value="forklift">Industrial Forklifts</SelectItem>
                    <SelectItem value="car">Executive Vehicles</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant={showAvailableOnly ? "default" : "outline"}
                  onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                  className={`w-full sm:w-auto ${showAvailableOnly ? 'bg-slate-900 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}
                >
                  {showAvailableOnly ? "Showing Available Only" : "Show Available Only"}
                </Button>
              </div>

              <div className="text-sm text-slate-600">
                Showing {filteredVehicles.length} of {stats.total} vehicles
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={() => onVehicleSelect(vehicle)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No vehicles found</h3>
            <p className="text-slate-600">No vehicles match your current filter criteria. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleList;
