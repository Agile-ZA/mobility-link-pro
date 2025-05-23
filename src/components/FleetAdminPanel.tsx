
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";
import AddVehicleForm from "./AddVehicleForm";
import { Vehicle } from "@/types/vehicle";
import { Plus, Edit } from "lucide-react";

interface FleetAdminPanelProps {
  onVehicleAdded: () => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
}

const FleetAdminPanel = ({ onVehicleAdded, onEditVehicle }: FleetAdminPanelProps) => {
  const { isFleetAdmin, userRole, loading } = useUserRole();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log("FleetAdminPanel - Role check:", { isFleetAdmin, userRole, loading });

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Don't render if user is not a fleet admin
  if (!isFleetAdmin) {
    console.log("User is not fleet admin, hiding panel");
    return null;
  }

  const handleAddSuccess = () => {
    setShowAddForm(false);
    onVehicleAdded();
  };

  if (showAddForm) {
    return (
      <AddVehicleForm 
        onSuccess={handleAddSuccess}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              Fleet Administration
              <Badge className="bg-blue-600 text-white">
                {userRole === 'admin' ? 'Admin' : 'Fleet Admin'}
              </Badge>
            </CardTitle>
            <p className="text-blue-700 text-sm mt-1">
              Manage vehicles, add new vehicles to the fleet, and edit existing vehicles
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Add New Vehicle</div>
              <div className="text-xs opacity-90">Expand the fleet</div>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 border-blue-300 hover:bg-blue-50"
            onClick={() => {
              // This could trigger edit mode for vehicles in the list
              console.log("Edit mode functionality can be implemented here");
            }}
          >
            <Edit className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Edit Vehicles</div>
              <div className="text-xs text-slate-600">Modify vehicle details</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetAdminPanel;
