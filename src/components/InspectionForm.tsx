
import { useState } from "react";
import { Vehicle, InspectionData } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InspectionFormProps {
  vehicle: Vehicle;
}

const InspectionForm = ({ vehicle }: InspectionFormProps) => {
  const [comments, setComments] = useState("");
  const [location, setLocation] = useState(vehicle.location);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const inspectionData: InspectionData = {
      vehicleId: vehicle.id,
      comments,
      location,
      timestamp: new Date().toISOString(),
      image: imageFile || undefined
    };

    // In a real app, this would be sent to SAP API
    console.log("Inspection data:", inspectionData);
    
    toast({
      title: "Inspection Submitted",
      description: `Inspection for ${vehicle.registrationNumber} has been recorded successfully.`,
    });

    // Reset form
    setComments("");
    setLocation(vehicle.location);
    setImageFile(null);
    const fileInput = document.getElementById("inspection-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Inspection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="inspection-image">Inspection Photo</Label>
            <Input
              id="inspection-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500">
              Upload a photo of the vehicle for this inspection
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter current vehicle location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Inspection Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any observations, damages, or notes about the vehicle condition..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Inspection
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InspectionForm;
