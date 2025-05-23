
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminVehicles } from "@/hooks/useAdminVehicles";
import AddVehicleForm from "./AddVehicleForm";
import VehicleEditForm from "./VehicleEditForm";
import AdminHeader from "./admin/AdminHeader";
import AdminStats from "./admin/AdminStats";
import AdminActions from "./admin/AdminActions";
import AdminVehicleTable from "./admin/AdminVehicleTable";
import UserRoleManagement from "./admin/UserRoleManagement";
import { ArrowLeft } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AdminPanelProps {
  onNavigateBack: () => void;
}

const AdminPanel = ({ onNavigateBack }: AdminPanelProps) => {
  const { userRole, isFleetAdmin } = useUserRole();
  const { vehicles, fetchVehicles } = useAdminVehicles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("vehicles");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchVehicles();
  };

  const handleEditSuccess = () => {
    setEditingVehicle(null);
    fetchVehicles(); // This should refresh the vehicle list
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    booked: vehicles.filter(v => v.status === 'booked').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
  };

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setShowAddForm(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </Button>
        </div>
        <AddVehicleForm 
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (editingVehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setEditingVehicle(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </Button>
        </div>
        <VehicleEditForm 
          vehicle={editingVehicle}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader onNavigateBack={onNavigateBack} userRole={userRole} />
      
      <AdminStats 
        total={stats.total}
        available={stats.available}
        booked={stats.booked}
        maintenance={stats.maintenance}
      />
      
      <Tabs defaultValue="vehicles" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="vehicles">Vehicle Management</TabsTrigger>
          {isFleetAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminActions 
              onAddVehicle={() => setShowAddForm(true)}
              onManageUsers={() => setActiveTab("users")}
              showUserManagement={false} // Hide the user management button in this tab
              stats={stats}
            />
          </div>

          <AdminVehicleTable 
            vehicles={vehicles}
            onEditVehicle={setEditingVehicle}
          />
        </TabsContent>

        {isFleetAdmin && (
          <TabsContent value="users" className="space-y-6">
            <UserRoleManagement isOpen={true} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPanel;
