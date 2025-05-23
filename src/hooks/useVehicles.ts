
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFleetAdmin } = useUserRole();

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
  }, [user?.id]);

  return {
    vehicles,
    loading,
    fetchVehicles,
    bookVehicle,
    returnVehicle,
  };
};
