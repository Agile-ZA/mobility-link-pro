
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Car, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookVehicleSectionProps {
  vehicle: Vehicle;
  userId: string;
  onVehicleUpdate?: () => void;
}

const BookVehicleSection = ({ vehicle, userId, onVehicleUpdate }: BookVehicleSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { bookVehicle } = useVehicles();
  const { toast } = useToast();

  const handleBookVehicle = async () => {
    console.log("=== BOOKING ATTEMPT STARTED ===");
    console.log("Vehicle ID:", vehicle.id);
    console.log("User ID:", userId);
    console.log("Vehicle Status:", vehicle.status);
    
    if (!userId) {
      console.error("No user ID provided");
      toast({
        title: "Authentication Error",
        description: "You must be logged in to book a vehicle.",
        variant: "destructive",
      });
      return;
    }

    if (vehicle.status !== 'available') {
      console.error("Vehicle is not available, current status:", vehicle.status);
      toast({
        title: "Vehicle Not Available",
        description: `This vehicle is currently ${vehicle.status} and cannot be booked.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Calling bookVehicle function...");
      const result = await bookVehicle(vehicle.id, userId);
      console.log("=== BOOKING RESULT ===", result);
      
      if (result.success) {
        console.log("Booking successful!");
        setIsBooked(true);
        
        toast({
          title: "✅ Vehicle Booked Successfully!",
          description: `${vehicle.registration_number} has been assigned to you. You can now use this vehicle.`,
        });
        
        // Trigger page update after a short delay to show the success state
        setTimeout(() => {
          if (onVehicleUpdate) {
            console.log("Calling onVehicleUpdate callback");
            onVehicleUpdate();
          } else {
            console.log("No callback provided, reloading page");
            window.location.reload();
          }
        }, 2000);
      } else {
        console.error("Booking failed with result:", result);
        const errorMessage = result.error?.message || "Failed to book the vehicle. Please try again.";
        toast({
          title: "❌ Booking Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("=== BOOKING ERROR ===", error);
      toast({
        title: "❌ Booking Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("=== BOOKING ATTEMPT FINISHED ===");
      setIsLoading(false);
    }
  };

  if (isBooked) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Vehicle Booked Successfully!</strong>
          <br />
          {vehicle.registration_number} has been assigned to you. The page will refresh shortly to show your booking.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-slate-600 text-sm">
        This vehicle is available for booking.
      </p>
      <Button 
        onClick={handleBookVehicle}
        className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-5"
        disabled={isLoading || !userId}
        size="lg"
      >
        <Car className="w-5 h-5" />
        <span className="font-medium">
          {isLoading ? 'Booking Vehicle...' : 'Book Vehicle'}
        </span>
      </Button>
      {!userId && (
        <p className="text-red-600 text-xs text-center">
          You must be logged in to book a vehicle
        </p>
      )}
    </div>
  );
};

export default BookVehicleSection;
