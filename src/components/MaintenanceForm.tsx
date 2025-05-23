
import { useState } from "react";
import { Vehicle, MaintenanceRequest } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wrench, X } from "lucide-react";

interface MaintenanceFormProps {
  vehicle: Vehicle;
  onCancel?: () => void;
}

const MaintenanceForm = ({ vehicle, onCancel }: MaintenanceFormProps) => {
  const [maintenanceType, setMaintenanceType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [requestedBy, setRequestedBy] = useState("");
  const { toast } = useToast();

  const maintenanceTypes = {
    truck: [
      "Oil Change",
      "Tire Replacement",
      "Brake Service",
      "Engine Maintenance",
      "Transmission Service",
      "Electrical Repair",
      "Body Repair",
      "Annual Inspection"
    ],
    forklift: [
      "Battery Maintenance",
      "Hydraulic Service",
      "Fork Replacement",
      "Chain Adjustment",
      "Tire Replacement",
      "Electrical Repair",
      "Engine Service",
      "Safety Inspection"
    ],
    car: [
      "Oil Change",
      "Tire Rotation",
      "Brake Service",
      "Battery Replacement",
      "Air Filter Change",
      "Fluid Top-up",
      "Annual Service",
      "Electrical Repair"
    ]
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const maintenanceRequest: MaintenanceRequest = {
      vehicleId: vehicle.id,
      type: maintenanceType,
      description,
      priority,
      requestedBy,
      timestamp: new Date().toISOString()
    };

    // In a real app, this would be sent to SAP API
    console.log("Maintenance request:", maintenanceRequest);
    
    toast({
      title: "Maintenance Request Submitted Successfully",
      description: `Maintenance request for ${vehicle.registration_number} has been submitted and will be processed by the maintenance team.`,
    });

    // Reset form
    setMaintenanceType("");
    setDescription("");
    setPriority("medium");
    setRequestedBy("");

    // Return to vehicle detail if onCancel is provided
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            Maintenance Request
          </CardTitle>
          {onCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel} 
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
              title="Cancel maintenance request"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-slate-600 text-sm">
          Submit a maintenance request for this vehicle to the maintenance team
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maintenance-type" className="text-slate-700 font-medium">Maintenance Type</Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger className="border-slate-300 focus:border-slate-500">
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes[vehicle.type].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-slate-700 font-medium">Priority Level</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger className="border-slate-300 focus:border-slate-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requested-by" className="text-slate-700 font-medium">Requested By</Label>
            <Input
              id="requested-by"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Your name or employee ID"
              className="border-slate-300 focus:border-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or maintenance required in detail..."
              rows={5}
              className="border-slate-300 focus:border-slate-500 resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button 
              type="submit" 
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
              disabled={!maintenanceType}
            >
              Submit Maintenance Request
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;
