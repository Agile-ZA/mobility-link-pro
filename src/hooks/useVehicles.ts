
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
      
      // Fleet admins can see all vehicles, regular users see vehicles from all sites
      // (filtering will be done in the UI)
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profile:profiles(full_name, email),
          site:sites(name, location)
        `);

      if (error) throw error;

      // Cast the data to ensure proper typing
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
    try {
      // Get the current vehicle data to capture initial readings
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('mileage, operating_hours')
        .eq('id', vehicleId)
        .single();

      if (vehicleError) throw vehicleError;

      const bookedAt = new Date().toISOString();

      // Update vehicle status
      const { error } = await supabase
        .from('vehicles')
        .update({
          status: 'booked',
          current_user_id: userId,
          booked_at: bookedAt,
        })
        .eq('id', vehicleId);

      if (error) throw error;

      // Create booking history record
      await createBookingHistory({
        vehicle_id: vehicleId,
        user_id: userId,
        booked_at: bookedAt,
        initial_mileage: vehicleData.mileage,
        initial_operating_hours: vehicleData.operating_hours,
      });

      await fetchVehicles();
      return { success: true };
    } catch (error) {
      console.error('Error booking vehicle:', error);
      return { success: false, error };
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
