
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

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
    console.log("Attempting to book vehicle:", vehicle.id, "for user:", userId);
    setIsLoading(true);
    
    try {
      const result = await bookVehicle(vehicle.id, userId);
      console.log("Book vehicle result:", result);
      
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
        console.error("Booking failed:", result.error);
        toast({
          title: "Booking Failed",
          description: result.error?.message || "Failed to book the vehicle. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error during booking:", error);
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-slate-600 text-sm">
        This vehicle is available for booking.
      </p>
      <Button 
        onClick={handleBookVehicle}
        className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-5"
        disabled={isLoading}
        size="lg"
      >
        <Car className="w-5 h-5" />
        <span className="font-medium">{isLoading ? 'Booking...' : 'Book Vehicle'}</span>
      </Button>
    </div>
  );
};

export default BookVehicleSection;
