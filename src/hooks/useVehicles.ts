
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  profile?: {
    full_name: string;
    email: string;
  };
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profile:profiles(full_name, email)
        `);

      if (error) throw error;

      setVehicles(data || []);
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
      const { error } = await supabase
        .from('vehicles')
        .update({
          status: 'booked',
          current_user_id: userId,
          booked_at: new Date().toISOString(),
        })
        .eq('id', vehicleId);

      if (error) throw error;

      await fetchVehicles();
      return { success: true };
    } catch (error) {
      console.error('Error booking vehicle:', error);
      return { success: false, error };
    }
  };

  const returnVehicle = async (vehicleId: string, updates: { mileage?: number; operating_hours?: number }) => {
    try {
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

      await fetchVehicles();
      return { success: true };
    } catch (error) {
      console.error('Error returning vehicle:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    fetchVehicles,
    bookVehicle,
    returnVehicle,
  };
};
