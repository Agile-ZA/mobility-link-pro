
export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'truck' | 'forklift' | 'car';
  make: string;
  model: string;
  year: number;
  isAvailable: boolean;
  imageUrl: string;
  mileage?: number;
  operatingHours?: number;
  location: string;
  lastInspection: string;
  nextMaintenance: string;
  fuelLevel?: number;
  batteryLevel?: number;
}

export interface InspectionData {
  vehicleId: string;
  image?: File;
  comments: string;
  location: string;
  timestamp: string;
}

export interface MaintenanceRequest {
  vehicleId: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
  timestamp: string;
}

export interface VehicleReadings {
  vehicleId: string;
  odometer?: number;
  operatingHours?: number;
  tyrePressures?: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  fuelLevel?: number;
  batteryLevel?: number;
  timestamp: string;
}
