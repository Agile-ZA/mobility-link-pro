
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/types/vehicle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSites } from "@/hooks/useSites";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehicleStatusInfo from "./VehicleStatusInfo";
import VehicleMetrics from "./VehicleMetrics";
import VehicleImageSection from "./VehicleImageSection";

interface VehicleEditFormProps {
  vehicle: Vehicle;
  onSuccess: () => void;
}

const VehicleEditForm = ({ vehicle, onSuccess }: VehicleEditFormProps) => {
  const { toast } = useToast();
  const { sites } = useSites();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    registration_number: vehicle.registration_number,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year.toString(),
    type: vehicle.type,
    status: vehicle.status,
    location: vehicle.location,
    mileage: vehicle.mileage?.toString() || '',
    operating_hours: vehicle.operating_hours?.toString() || '',
    fuel_level: vehicle.fuel_level?.toString() || '',
    battery_level: vehicle.battery_level?.toString() || '',
    image_url: vehicle.image_url || '',
    site_id: vehicle.site_id || 'no-site'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        registration_number: formData.registration_number,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        type: formData.type,
        status: formData.status,
        location: formData.location,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        operating_hours: formData.operating_hours ? parseInt(formData.operating_hours) : null,
        fuel_level: formData.fuel_level ? parseInt(formData.fuel_level) : null,
        battery_level: formData.battery_level ? parseInt(formData.battery_level) : null,
        image_url: formData.image_url || null,
        site_id: formData.site_id === 'no-site' ? null : formData.site_id
      };

      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', vehicle.id);

      if (error) throw error;

      toast({
        title: "Vehicle Updated",
        description: "Vehicle details have been successfully updated.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VehicleBasicInfo formData={formData} onInputChange={handleInputChange} />
            <VehicleStatusInfo formData={formData} onInputChange={handleInputChange} />
            <VehicleMetrics formData={formData} onInputChange={handleInputChange} />
            <VehicleImageSection formData={formData} onInputChange={handleInputChange} />
            
            {/* Site Assignment Section */}
            <div className="space-y-2">
              <Label htmlFor="site_id">Site Assignment</Label>
              <Select 
                value={formData.site_id} 
                onValueChange={(value) => handleInputChange('site_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-site">No site assignment</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} {site.location ? `(${site.location})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Vehicle"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleEditForm;
