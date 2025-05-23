
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/types/vehicle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VehicleEditFormProps {
  vehicle: Vehicle;
  onSuccess: () => void;
}

const VehicleEditForm = ({ vehicle, onSuccess }: VehicleEditFormProps) => {
  const { toast } = useToast();
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
    image_url: vehicle.image_url || ''
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
        image_url: formData.image_url || null
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
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={(e) => handleInputChange('registration_number', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Commercial Truck</SelectItem>
                  <SelectItem value="forklift">Industrial Forklift</SelectItem>
                  <SelectItem value="car">Executive Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (optional)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operating_hours">Operating Hours (optional)</Label>
              <Input
                id="operating_hours"
                type="number"
                value={formData.operating_hours}
                onChange={(e) => handleInputChange('operating_hours', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_level">Fuel Level % (optional)</Label>
              <Input
                id="fuel_level"
                type="number"
                min="0"
                max="100"
                value={formData.fuel_level}
                onChange={(e) => handleInputChange('fuel_level', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery_level">Battery Level % (optional)</Label>
              <Input
                id="battery_level"
                type="number"
                min="0"
                max="100"
                value={formData.battery_level}
                onChange={(e) => handleInputChange('battery_level', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/vehicle-image.jpg"
              />
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
