
import { Card, CardContent } from "@/components/ui/card";
import { Car, Users } from "lucide-react";

interface AdminStatsProps {
  total: number;
  available: number;
  booked: number;
  maintenance: number;
}

const AdminStats = ({ total, available, booked, maintenance }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
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
              <p className="text-2xl font-bold text-green-700">{available}</p>
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
              <p className="text-2xl font-bold text-blue-700">{booked}</p>
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
              <p className="text-2xl font-bold text-amber-700">{maintenance}</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              🔧
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
