
export interface Vehicle {
  id: string;
  registration_number: string;
  type: 'truck' | 'forklift' | 'car';
  make: string;
  model: string;
  year: number;
  status: 'available' | 'booked' | 'maintenance' | 'damaged';
  image_url: string;
  mileage?: number;
  operating_hours?: number;
  location: string;
  last_inspection: string;
  next_maintenance: string;
  fuel_level?: number;
  battery_level?: number;
  current_user_id?: string;
  booked_at?: string;
  site_id?: string;
  profile?: {
    full_name: string;
    email: string;
  };
  site?: {
    name: string;
    location: string;
  };
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

export interface VehicleReturn {
  vehicleId: string;
  odometer: number;
  operatingHours?: number;
  image?: File;
  comments?: string;
  returnedBy: string;
  timestamp: string;
}
