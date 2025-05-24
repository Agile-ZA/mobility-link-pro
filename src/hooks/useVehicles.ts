
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useBookingHistory } from '@/hooks/useBookingHistory';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFleetAdmin } = useUserRole();
  const { createBookingHistory, updateBookingHistory } = useBookingHistory();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      console.log("Fetching vehicles...");
      
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profile:profiles(full_name, email),
          site:sites(name, location)
        `);

      if (error) {
        console.error("Error fetching vehicles:", error);
        throw error;
      }

      console.log("Vehicles fetched successfully:", data);

      const typedVehicles = (data || []).map(vehicle => ({
        ...vehicle,
        type: vehicle.type as 'truck' | 'forklift' | 'car'
      })) as Vehicle[];

      setVehicles(typedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error Loading Vehicles",
        description: "Failed to load vehicle data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookVehicle = async (vehicleId: string, userId: string) => {
    console.log("=== BOOK VEHICLE FUNCTION CALLED ===");
    console.log("Parameters:", { vehicleId, userId });
    
    if (!vehicleId || !userId) {
      console.error("Missing required parameters:", { vehicleId, userId });
      return { 
        success: false, 
        error: { message: "Missing vehicle ID or user ID" }
      };
    }

    try {
      // Get the current vehicle data
      console.log("Step 1: Fetching current vehicle data...");
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('mileage, operating_hours, status, registration_number')
        .eq('id', vehicleId)
        .single();

      if (vehicleError) {
        console.error("Error fetching vehicle data:", vehicleError);
        return { 
          success: false, 
          error: { message: `Failed to fetch vehicle data: ${vehicleError.message}` }
        };
      }

      console.log("Current vehicle data:", vehicleData);

      // Check if vehicle is still available
      if (vehicleData.status !== 'available') {
        console.error("Vehicle is not available, current status:", vehicleData.status);
        return { 
          success: false, 
          error: { message: `Vehicle is currently ${vehicleData.status} and cannot be booked.` }
        };
      }

      const bookedAt = new Date().toISOString();
      console.log("Step 2: Booking vehicle at:", bookedAt);

      // Update vehicle status
      console.log("Step 3: Updating vehicle status to 'booked'...");
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({
          status: 'booked',
          current_user_id: userId,
          booked_at: bookedAt,
        })
        .eq('id', vehicleId);

      if (updateError) {
        console.error("Error updating vehicle status:", updateError);
        return { 
          success: false, 
          error: { message: `Failed to update vehicle: ${updateError.message}` }
        };
      }

      console.log("Step 4: Vehicle status updated successfully");

      // Create booking history record (non-blocking)
      console.log("Step 5: Creating booking history record...");
      try {
        const historyResult = await createBookingHistory({
          vehicle_id: vehicleId,
          user_id: userId,
          booked_at: bookedAt,
          initial_mileage: vehicleData.mileage,
          initial_operating_hours: vehicleData.operating_hours,
        });

        if (!historyResult.success) {
          console.warn("Failed to create booking history (non-blocking):", historyResult.error);
        } else {
          console.log("Booking history created successfully");
        }
      } catch (historyError) {
        console.warn("Error creating booking history (non-blocking):", historyError);
      }

      console.log("Step 6: Refreshing vehicles list...");
      await fetchVehicles();
      
      console.log("=== BOOKING COMPLETED SUCCESSFULLY ===");
      return { success: true };
      
    } catch (error) {
      console.error('=== BOOKING ERROR ===', error);
      return { 
        success: false, 
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  };

  const returnVehicle = async (vehicleId: string, updates: { mileage?: number; operating_hours?: number; comments?: string }) => {
    try {
      // Get current booking to find the active booking history record
      const { data: currentBooking, error: bookingError } = await supabase
        .from('booking_history')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .is('returned_at', null)
        .single();

      if (bookingError && bookingError.code !== 'PGRST116') {
        throw bookingError;
      }

      const returnedAt = new Date().toISOString();

      // Update vehicle status
      const updateData: any = {
        status: 'available',
        current_user_id: null,
        booked_at: null,
      };

      if (updates.mileage) updateData.mileage = updates.mileage;
      if (updates.operating_hours) updateData.operating_hours = updates.operating_hours;

      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', vehicleId);

      if (error) throw error;

      // Update booking history record if it exists
      if (currentBooking) {
        await updateBookingHistory(currentBooking.id, {
          returned_at: returnedAt,
          return_mileage: updates.mileage,
          return_operating_hours: updates.operating_hours,
          comments: updates.comments,
        });
      }

      await fetchVehicles();
      return { success: true };
    } catch (error) {
      console.error('Error returning vehicle:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user?.id]);

  return {
    vehicles,
    loading,
    fetchVehicles,
    bookVehicle,
    returnVehicle,
  };
};
