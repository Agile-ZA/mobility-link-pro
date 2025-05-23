
import { useState } from "react";
import { Vehicle, MaintenanceRequest } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceFormProps {
  vehicle: Vehicle;
}

const MaintenanceForm = ({ vehicle }: MaintenanceFormProps) => {
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
      title: "Maintenance Request Submitted",
      description: `Maintenance request for ${vehicle.registration_number} has been submitted successfully.`,
    });

    // Reset form
    setMaintenanceType("");
    setDescription("");
    setPriority("medium");
    setRequestedBy("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maintenance-type">Maintenance Type</Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger>
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
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger>
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
            <Label htmlFor="requested-by">Requested By</Label>
            <Input
              id="requested-by"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Your name or employee ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or maintenance required in detail..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!maintenanceType}>
            Submit Maintenance Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;
