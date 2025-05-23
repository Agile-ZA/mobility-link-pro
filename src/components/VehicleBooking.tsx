
import { useState } from "react";
import { Vehicle, VehicleReturn } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, Calendar } from "lucide-react";

interface VehicleBookingProps {
  vehicle: Vehicle;
  onStatusUpdate: (vehicleId: string, newStatus: Vehicle['status'], userData?: Vehicle['currentUser']) => void;
}

const VehicleBooking = ({ vehicle, onStatusUpdate }: VehicleBookingProps) => {
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [odometer, setOdometer] = useState(vehicle.mileage?.toString() || "");
  const [operatingHours, setOperatingHours] = useState(vehicle.operatingHours?.toString() || "");
  const [comments, setComments] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleBookVehicle = () => {
    if (!userName.trim()) {
      toast({
        title: "User Name Required",
        description: "Please enter your name to book the vehicle.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      name: userName,
      id: `user-${Date.now()}`,
      bookedAt: new Date().toISOString(),
    };

    onStatusUpdate(vehicle.id, 'booked', userData);
    
    toast({
      title: "Vehicle Booked Successfully",
      description: `${vehicle.registrationNumber} has been booked to ${userName}.`,
    });
    
    setUserName("");
  };

  const handleReturnVehicle = () => {
    if (!odometer.trim()) {
      toast({
        title: "Odometer Reading Required",
        description: "Please provide the current odometer reading.",
        variant: "destructive",
      });
      return;
    }

    const returnData: VehicleReturn = {
      vehicleId: vehicle.id,
      odometer: parseInt(odometer),
      operatingHours: operatingHours ? parseInt(operatingHours) : undefined,
      image: imageFile || undefined,
      comments: comments || undefined,
      returnedBy: vehicle.currentUser?.name || "Unknown User",
      timestamp: new Date().toISOString(),
    };

    console.log("Vehicle return data:", returnData);
    
    onStatusUpdate(vehicle.id, 'available');
    
    toast({
      title: "Vehicle Returned Successfully",
      description: `${vehicle.registrationNumber} has been returned and is now available.`,
    });
    
    // Reset form
    setShowReturnForm(false);
    setOdometer(vehicle.mileage?.toString() || "");
    setOperatingHours(vehicle.operatingHours?.toString() || "");
    setComments("");
    setImageFile(null);
  };

  const getStatusBadgeColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700';
      case 'booked':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'maintenance':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'damaged':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'maintenance':
        return 'Maintenance Required';
      case 'damaged':
        return 'Damaged';
      default:
        return 'Unknown';
    }
  };

  if (vehicle.status === 'maintenance' || vehicle.status === 'damaged') {
    return (
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className={`w-8 h-8 ${getStatusBadgeColor(vehicle.status)} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">!</span>
            </div>
            Vehicle Status: {getStatusLabel(vehicle.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-slate-600">
            This vehicle is currently unavailable due to {vehicle.status === 'maintenance' ? 'required maintenance' : 'damage'}.
            Please contact the fleet manager for more information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className={`w-8 h-8 ${getStatusBadgeColor(vehicle.status)} rounded-lg flex items-center justify-center`}>
            <User className="w-4 h-4 text-white" />
          </div>
          Vehicle Booking & Return
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {vehicle.status === 'available' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-slate-700 font-medium">
                Your Name
              </Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="border-slate-300 focus:border-slate-500"
              />
            </div>
            <Button 
              onClick={handleBookVehicle}
              className="w-full bg-slate-900 hover:bg-slate-800"
            >
              Book Vehicle
            </Button>
          </div>
        )}

        {vehicle.status === 'booked' && vehicle.currentUser && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Currently Booked</span>
              </div>
              <p className="text-blue-800">
                <strong>User:</strong> {vehicle.currentUser.name}
              </p>
              <p className="text-blue-700 text-sm flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                Booked: {new Date(vehicle.currentUser.bookedAt).toLocaleString()}
              </p>
            </div>

            {!showReturnForm ? (
              <Button 
                onClick={() => setShowReturnForm(true)}
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50"
              >
                Return Vehicle
              </Button>
            ) : (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <h4 className="font-medium text-slate-900">Vehicle Return Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="odometer" className="text-slate-700 font-medium">
                      Odometer Reading *
                    </Label>
                    <Input
                      id="odometer"
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="Current mileage"
                      className="border-slate-300 focus:border-slate-500"
                      required
                    />
                  </div>

                  {vehicle.type === 'forklift' && (
                    <div className="space-y-2">
                      <Label htmlFor="operatingHours" className="text-slate-700 font-medium">
                        Operating Hours
                      </Label>
                      <Input
                        id="operatingHours"
                        type="number"
                        value={operatingHours}
                        onChange={(e) => setOperatingHours(e.target.value)}
                        placeholder="Current operating hours"
                        className="border-slate-300 focus:border-slate-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnImage" className="text-slate-700 font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Return Photo (Optional)
                  </Label>
                  <Input
                    id="returnImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border-slate-300"
                  />
                  {imageFile && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Image selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnComments" className="text-slate-700 font-medium">
                    Return Comments (Optional)
                  </Label>
                  <Textarea
                    id="returnComments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Any issues, damage, or observations..."
                    rows={3}
                    className="border-slate-300 focus:border-slate-500 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleReturnVehicle}
                    className="flex-1 bg-slate-900 hover:bg-slate-800"
                  >
                    Confirm Return
                  </Button>
                  <Button 
                    onClick={() => setShowReturnForm(false)}
                    variant="outline"
                    className="flex-1 border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleBooking;
