
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookingHistory } from '@/types/bookingHistory';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export const useBookingHistory = (vehicleId?: string) => {
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFleetAdmin } = useUserRole();

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('booking_history')
        .select(`
          *,
          profiles!user_id(full_name, email),
          vehicles!vehicle_id(registration_number, make, model)
        `)
        .order('booked_at', { ascending: false });

      // If vehicleId is provided, filter by that vehicle
      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our BookingHistory type
      const transformedData: BookingHistory[] = (data || []).map(record => ({
        ...record,
        profile: record.profiles,
        vehicle: record.vehicles
      }));

      setBookingHistory(transformedData);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast({
        title: "Error Loading Booking History",
        description: "Failed to load booking history data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBookingHistory = async (bookingData: {
    vehicle_id: string;
    user_id: string;
    booked_at: string;
    initial_mileage?: number;
    initial_operating_hours?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('booking_history')
        .insert(bookingData);

      if (error) throw error;

      await fetchBookingHistory();
      return { success: true };
    } catch (error) {
      console.error('Error creating booking history:', error);
      return { success: false, error };
    }
  };

  const updateBookingHistory = async (id: string, updates: {
    returned_at?: string;
    return_mileage?: number;
    return_operating_hours?: number;
    comments?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('booking_history')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchBookingHistory();
      return { success: true };
    } catch (error) {
      console.error('Error updating booking history:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (user && (isFleetAdmin || vehicleId)) {
      fetchBookingHistory();
    }
  }, [user?.id, isFleetAdmin, vehicleId]);

  return {
    bookingHistory,
    loading,
    fetchBookingHistory,
    createBookingHistory,
    updateBookingHistory,
  };
};
