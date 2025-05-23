
import { useMemo, useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { useAuth } from "@/hooks/useAuth";
import { useSites } from "@/hooks/useSites"; 
import VehicleCard from "./VehicleCard";
import FleetAdminPanel from "./FleetAdminPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleListProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const VehicleList = ({ onVehicleSelect }: VehicleListProps) => {
  const { vehicles, loading } = useVehicles();
  const { user } = useAuth();
  const { sites, userSite, loading: siteLoading } = useSites();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("available");
  const [selectedSite, setSelectedSite] = useState<string>("my-site");

  // Filter vehicles based on selected filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const typeMatch = selectedType === "all" || vehicle.type === selectedType;
      const statusMatch = selectedStatus === "all" || vehicle.status === selectedStatus;
      
      // Site filtering
      let siteMatch = true;
      if (selectedSite === "my-site") {
        siteMatch = vehicle.site_id === userSite?.id;
      } else if (selectedSite !== "all") {
        siteMatch = vehicle.site_id === selectedSite;
      }
      
      // If showing "available" status, also include vehicles assigned to current user
      if (selectedStatus === "available" && vehicle.status === "booked" && vehicle.current_user_id === user?.id) {
        return typeMatch && siteMatch;
      }
      
      return typeMatch && statusMatch && siteMatch;
    });
  }, [vehicles, selectedType, selectedStatus, selectedSite, user?.id, userSite?.id]);

  // Get user's assigned vehicle
  const userVehicle = vehicles.find(v => v.current_user_id === user?.id);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.status === 'available').length;
    const booked = vehicles.filter(v => v.status === 'booked').length;
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
    const damaged = vehicles.filter(v => v.status === 'damaged').length;
    return { total, available, booked, maintenance, damaged };
  }, [vehicles]);

  if (loading || siteLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          <span className="text-slate-600">Loading vehicles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fleet Overview</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-600">Monitor and manage your corporate vehicle fleet</p>
            {userSite && (
              <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-800">
                <MapPin className="w-3 h-3" />
                {userSite.name}
              </Badge>
            )}
          </div>
        </div>

        {userVehicle && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Your Assigned Vehicle</p>
                  <p className="text-lg font-bold text-blue-900">{userVehicle.registration_number}</p>
                  <p className="text-sm text-blue-700">
                    {userVehicle.make} {userVehicle.model} • 
                    {userVehicle.site?.name ? ` ${userVehicle.site.name}` : ` ${userVehicle.location}`}
                  </p>
                </div>
                <button
                  onClick={() => onVehicleSelect(userVehicle)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Vehicle
                </button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  🚗
                </div>
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
                  <p className="text-sm font-medium text-slate-600">Booked</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.booked}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  👤
                </div>
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

          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Damaged</p>
                  <p className="text-2xl font-bold text-red-700">{stats.damaged}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  ⚠️
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-300">
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 z-50">
                    <SelectItem value="my-site">My Site ({userSite?.name || 'None'})</SelectItem>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-300">
                    <SelectValue placeholder="Filter by vehicle type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 z-50">
                    <SelectItem value="all">All Vehicle Types</SelectItem>
                    <SelectItem value="truck">Commercial Trucks</SelectItem>
                    <SelectItem value="forklift">Industrial Forklifts</SelectItem>
                    <SelectItem value="car">Executive Vehicles</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-300">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 z-50">
                    <SelectItem value="available">Available to Book</SelectItem>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-slate-600">
                Showing {filteredVehicles.length} of {stats.total} vehicles
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={() => onVehicleSelect(vehicle)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No vehicles found</h3>
            <p className="text-slate-600">No vehicles match your current filter criteria. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleList;
