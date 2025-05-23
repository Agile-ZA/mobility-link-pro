
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";
import { useVehicles } from "@/hooks/useVehicles";
import AddVehicleForm from "./AddVehicleForm";
import { Plus, Edit, ArrowLeft, Users, Car, BarChart3 } from "lucide-react";

interface AdminPanelProps {
  onNavigateBack: () => void;
}

const AdminPanel = ({ onNavigateBack }: AdminPanelProps) => {
  const { userRole } = useUserRole();
  const { vehicles, fetchVehicles } = useVehicles();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchVehicles();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vehicles
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-slate-900">Fleet Administration</h2>
          <Badge className="bg-blue-600 text-white">
            {userRole === 'admin' ? 'Admin' : 'Fleet Admin'}
          </Badge>
        </div>
        <p className="text-slate-600">Manage your fleet operations and vehicle inventory</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Car className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-green-700">{stats.available}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                ✅
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Use</p>
                <p className="text-2xl font-bold text-blue-700">{stats.booked}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Maintenance</p>
                <p className="text-2xl font-bold text-amber-700">{stats.maintenance}</p>
              </div>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                🔧
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Vehicle Management
            </CardTitle>
            <p className="text-blue-700 text-sm">
              Add new vehicles to the fleet and manage existing inventory
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="h-16 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-semibold">Add New Vehicle</div>
                  <div className="text-xs opacity-90">Expand the fleet</div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-2 border-blue-300 hover:bg-blue-50"
                onClick={() => {
                  console.log("Vehicle edit functionality");
                }}
              >
                <Edit className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-semibold">Edit Vehicles</div>
                  <div className="text-xs text-slate-600">Modify vehicle details</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Fleet Analytics
            </CardTitle>
            <p className="text-slate-600 text-sm">
              Monitor fleet performance and utilization metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Fleet Utilization</span>
                <span className="text-sm font-semibold">
                  {Math.round((stats.booked / stats.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.booked / stats.total) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Availability Rate</p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round((stats.available / stats.total) * 100)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Maintenance Rate</p>
                  <p className="text-lg font-bold text-amber-600">
                    {Math.round((stats.maintenance / stats.total) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
