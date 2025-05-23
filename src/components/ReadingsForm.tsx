import { useState } from "react";
import { Vehicle, VehicleReadings } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ReadingsFormProps {
  vehicle: Vehicle;
}

const ReadingsForm = ({ vehicle }: ReadingsFormProps) => {
  const [odometer, setOdometer] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [tyrePressures, setTyrePressures] = useState({
    frontLeft: "",
    frontRight: "",
    rearLeft: "",
    rearRight: ""
  });
  const [fuelLevel, setFuelLevel] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const readings: VehicleReadings = {
      vehicleId: vehicle.id,
      timestamp: new Date().toISOString(),
      ...(odometer && { odometer: parseFloat(odometer) }),
      ...(operatingHours && { operatingHours: parseFloat(operatingHours) }),
      ...(fuelLevel && { fuelLevel: parseFloat(fuelLevel) }),
      ...(batteryLevel && { batteryLevel: parseFloat(batteryLevel) }),
      ...(vehicle.type === 'truck' && tyrePressures.frontLeft && {
        tyrePressures: {
          frontLeft: parseFloat(tyrePressures.frontLeft),
          frontRight: parseFloat(tyrePressures.frontRight),
          rearLeft: parseFloat(tyrePressures.rearLeft),
          rearRight: parseFloat(tyrePressures.rearRight)
        }
      })
    };

    // In a real app, this would be sent to SAP API
    console.log("Vehicle readings:", readings);
    
    toast({
      title: "Readings Captured",
      description: `Readings for ${vehicle.registration_number} have been recorded successfully.`,
    });

    // Reset form and close dialog
    setOdometer("");
    setOperatingHours("");
    setTyrePressures({ frontLeft: "", frontRight: "", rearLeft: "", rearRight: "" });
    setFuelLevel("");
    setBatteryLevel("");
    setIsOpen(false);
  };

  const renderReadingFields = () => {
    switch (vehicle.type) {
      case 'truck':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer Reading (miles)</Label>
              <Input
                id="odometer"
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="Enter current mileage"
              />
            </div>

            <div className="space-y-4">
              <Label>Tire Pressures (PSI)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="front-left">Front Left</Label>
                  <Input
                    id="front-left"
                    type="number"
                    value={tyrePressures.frontLeft}
                    onChange={(e) => setTyrePressures(prev => ({ ...prev, frontLeft: e.target.value }))}
                    placeholder="PSI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="front-right">Front Right</Label>
                  <Input
                    id="front-right"
                    type="number"
                    value={tyrePressures.frontRight}
                    onChange={(e) => setTyrePressures(prev => ({ ...prev, frontRight: e.target.value }))}
                    placeholder="PSI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rear-left">Rear Left</Label>
                  <Input
                    id="rear-left"
                    type="number"
                    value={tyrePressures.rearLeft}
                    onChange={(e) => setTyrePressures(prev => ({ ...prev, rearLeft: e.target.value }))}
                    placeholder="PSI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rear-right">Rear Right</Label>
                  <Input
                    id="rear-right"
                    type="number"
                    value={tyrePressures.rearRight}
                    onChange={(e) => setTyrePressures(prev => ({ ...prev, rearRight: e.target.value }))}
                    placeholder="PSI"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel-level">Fuel Level (%)</Label>
              <Input
                id="fuel-level"
                type="number"
                min="0"
                max="100"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                placeholder="0-100"
              />
            </div>
          </>
        );

      case 'forklift':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="operating-hours">Operating Hours</Label>
              <Input
                id="operating-hours"
                type="number"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Enter total operating hours"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery-level">Battery Level (%)</Label>
              <Input
                id="battery-level"
                type="number"
                min="0"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                placeholder="0-100"
              />
            </div>
          </>
        );

      case 'car':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer Reading (miles)</Label>
              <Input
                id="odometer"
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="Enter current mileage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel-level">Fuel Level (%)</Label>
              <Input
                id="fuel-level"
                type="number"
                min="0"
                max="100"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                placeholder="0-100"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2 w-full"
        >
          <span className="text-2xl">📊</span>
          <span>Capture Readings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Capture Vehicle Readings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderReadingFields()}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Readings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingsForm;
