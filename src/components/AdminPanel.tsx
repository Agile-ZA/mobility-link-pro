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

interface AdminPanelProps {
  onNavigateBack: () => void;
}

const AdminPanel = ({ onNavigateBack }: AdminPanelProps) => {
  const { userRole, isAdmin } = useUserRole();
  const { vehicles, fetchVehicles } = useAdminVehicles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
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

      <AdminActions 
        onAddVehicle={() => setShowAddForm(true)}
        onManageUsers={() => setShowUserManagement(!showUserManagement)}
        stats={stats}
        showUserManagement={isAdmin}
      />

      <UserRoleManagement isOpen={showUserManagement && isAdmin} />

      <AdminVehicleTable 
        vehicles={vehicles}
        onEditVehicle={setEditingVehicle}
      />
    </div>
  );
};

export default AdminPanel;
