
import { useState } from "react";
import { Vehicle, InspectionData } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, FileText } from "lucide-react";

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

    console.log("Inspection data submitted:", inspectionData);
    
    toast({
      title: "Inspection Submitted Successfully",
      description: `Vehicle inspection for ${vehicle.registrationNumber} has been recorded and will be synchronized with SAP.`,
    });

    // Reset form
    setComments("");
    setLocation(vehicle.location);
    setImageFile(null);
    const fileInput = document.getElementById("inspection-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Vehicle Inspection Report
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Document vehicle condition, capture photos, and record current location
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="inspection-image" className="text-slate-700 font-medium flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Inspection Photograph
              </Label>
              <Input
                id="inspection-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border-slate-300"
              />
              <p className="text-sm text-slate-500">
                Capture high-quality photos showing vehicle condition, damage, or specific areas of concern
              </p>
              {imageFile && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Image selected: {imageFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Current Vehicle Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter precise location (building, zone, GPS coordinates)"
                className="border-slate-300 focus:border-slate-500"
                required
              />
              <p className="text-sm text-slate-500">
                Specify exact location for fleet tracking and logistics
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-slate-700 font-medium">
              Inspection Notes & Observations
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Document vehicle condition, any visible damage, wear indicators, cleanliness, operational status, safety concerns, or other relevant observations..."
              rows={6}
              className="border-slate-300 focus:border-slate-500 resize-none"
              required
            />
            <p className="text-sm text-slate-500">
              Provide detailed observations for maintenance planning and safety compliance
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button 
              type="submit" 
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
            >
              Submit Inspection Report
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50"
              onClick={() => {
                setComments("");
                setLocation(vehicle.location);
                setImageFile(null);
                const fileInput = document.getElementById("inspection-image") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
              }}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InspectionForm;
