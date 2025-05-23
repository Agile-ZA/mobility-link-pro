
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BookVehicleSectionProps {
  vehicle: Vehicle;
  userId: string;
  onVehicleUpdate?: () => void;
}

const BookVehicleSection = ({ vehicle, userId, onVehicleUpdate }: BookVehicleSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { bookVehicle } = useVehicles();
  const { toast } = useToast();

  const handleBookVehicle = async () => {
    setIsLoading(true);
    const result = await bookVehicle(vehicle.id, userId);
    
    if (result.success) {
      toast({
        title: "Vehicle Booked Successfully",
        description: `${vehicle.registration_number} has been booked to you.`,
      });
      // Trigger page update
      if (onVehicleUpdate) {
        onVehicleUpdate();
      } else {
        window.location.reload();
      }
    } else {
      toast({
        title: "Booking Failed",
        description: "Failed to book the vehicle. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-600 mb-4">
        This vehicle is available for booking. Click below to assign it to yourself.
      </p>
      <Button 
        onClick={handleBookVehicle}
        className="w-full bg-slate-900 hover:bg-slate-800"
        disabled={isLoading}
      >
        {isLoading ? 'Booking...' : 'Book Vehicle'}
      </Button>
    </div>
  );
};

export default BookVehicleSection;
