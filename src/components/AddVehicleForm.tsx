
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useVehicleOperations } from "@/hooks/useVehicleOperations";
import { useSites } from "@/hooks/useSites";
import VehicleBasicInfo from "./VehicleBasicInfo";
import { ArrowLeft } from "lucide-react";
import { Vehicle } from "@/types/vehicle";

interface AddVehicleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVehicleForm = ({ onSuccess, onCancel }: AddVehicleFormProps) => {
  const [formData, setFormData] = useState({
    registration_number: '',
    make: '',
    model: '',
    year: '',
    type: 'truck' as 'truck' | 'forklift' | 'car',
    location: '',
    last_inspection: new Date().toISOString().split('T')[0],
    next_maintenance: new Date().toISOString().split('T')[0],
    image_url: '',
    site_id: '',
  });
  const { sites } = useSites();
  const { addVehicle, loading } = useVehicleOperations();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    if (field === 'type') {
      setFormData(prev => ({ ...prev, [field]: value as 'truck' | 'forklift' | 'car' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const requiredFields = ['registration_number', 'make', 'model', 'year', 'type', 'location', 'last_inspection', 'next_maintenance'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in all required fields, including ${field.replace(/_/g, ' ')}.`,
          variant: "destructive",
        });
        return;
      }
    }

    const vehicleData: Partial<Vehicle> = {
      ...formData,
      year: parseInt(formData.year),
      status: 'available' as 'available' | 'booked' | 'maintenance' | 'damaged',
    };

    const result = await addVehicle(vehicleData);

    if (result.success) {
      toast({
        title: "Vehicle Added",
        description: `${formData.make} ${formData.model} - ${formData.registration_number} has been added to the fleet.`,
      });
      onSuccess();
    } else {
      toast({
        title: "Error Adding Vehicle",
        description: "Failed to add the vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900">Add New Vehicle</CardTitle>
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <VehicleBasicInfo formData={formData} onInputChange={handleInputChange} />

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
            <Label htmlFor="last_inspection">Last Inspection Date</Label>
            <Input
              type="date"
              id="last_inspection"
              value={formData.last_inspection}
              onChange={(e) => handleInputChange('last_inspection', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_maintenance">Next Maintenance Date</Label>
            <Input
              type="date"
              id="next_maintenance"
              value={formData.next_maintenance}
              onChange={(e) => handleInputChange('next_maintenance', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_id">Site Assignment</Label>
            <Select value={formData.site_id} onValueChange={(value) => handleInputChange('site_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name} ({site.location || 'No location'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800">
            {loading ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVehicleForm;
