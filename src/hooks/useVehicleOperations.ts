
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
      // Ensure required fields are present and properly typed for database insert
      const insertData = {
        registration_number: vehicleData.registration_number!,
        make: vehicleData.make!,
        model: vehicleData.model!,
        year: vehicleData.year!,
        type: vehicleData.type!,
        status: vehicleData.status!,
        location: vehicleData.location!,
        last_inspection: vehicleData.last_inspection!,
        next_maintenance: vehicleData.next_maintenance!,
        image_url: vehicleData.image_url || null,
        site_id: vehicleData.site_id || null,
        mileage: vehicleData.mileage || null,
        operating_hours: vehicleData.operating_hours || null,
        fuel_level: vehicleData.fuel_level || null,
        battery_level: vehicleData.battery_level || null,
      };

      const { error } = await supabase
        .from('vehicles')
        .insert(insertData);
        
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
