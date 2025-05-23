
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/vehicle';

export const useVehicleOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    setLoading(true);
    
    try {
      // Make sure site_id is included in the data
      const { error } = await supabase
        .from('vehicles')
        .insert([vehicleData]);
        
      if (error) throw error;
      
      toast({
        title: "Vehicle Added",
        description: "The new vehicle has been added to the fleet.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error Adding Vehicle",
        description: "There was a problem adding the new vehicle.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', vehicleId);
        
      if (error) throw error;
      
      toast({
        title: "Vehicle Updated",
        description: "The vehicle has been updated successfully.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error Updating Vehicle",
        description: "There was a problem updating the vehicle.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    addVehicle,
    updateVehicle
  };
};
