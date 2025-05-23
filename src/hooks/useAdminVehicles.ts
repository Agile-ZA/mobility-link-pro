
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/vehicle';

export const useAdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllVehicles = async () => {
    try {
      setLoading(true);
      
      // Fetch ALL vehicles without any site filtering for admin users
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
      console.error('Error fetching all vehicles:', error);
      toast({
        title: "Error Loading Vehicles",
        description: "Failed to load vehicle data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  return {
    vehicles,
    loading,
    fetchVehicles: fetchAllVehicles,
  };
};
