
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Users } from "lucide-react";

interface AdminActionsProps {
  onAddVehicle: () => void;
  onManageUsers: () => void;
  stats: {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
  };
}

const AdminActions = ({ onAddVehicle, onManageUsers, stats }: AdminActionsProps) => {
  return (
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
              onClick={onAddVehicle}
              className="h-auto py-4 px-6 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold text-base">Add New Vehicle</div>
                <div className="text-sm opacity-90">Expand the fleet</div>
              </div>
            </Button>
            
            <Button 
              onClick={onManageUsers}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-center gap-3 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Users className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold text-base">Manage Users</div>
                <div className="text-sm opacity-90">Assign roles and permissions</div>
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
  );
};

export default AdminActions;
