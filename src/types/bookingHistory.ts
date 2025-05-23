
export interface BookingHistory {
  id: string;
  vehicle_id: string;
  user_id: string;
  booked_at: string;
  returned_at?: string;
  initial_mileage?: number;
  return_mileage?: number;
  initial_operating_hours?: number;
  return_operating_hours?: number;
  comments?: string;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
  };
  vehicle?: {
    registration_number: string;
    make: string;
    model: string;
  };
}
