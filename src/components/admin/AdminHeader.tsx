
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface AdminHeaderProps {
  onNavigateBack: () => void;
  userRole: string | null;
}

const AdminHeader = ({ onNavigateBack, userRole }: AdminHeaderProps) => {
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
    </div>
  );
};

export default AdminHeader;
