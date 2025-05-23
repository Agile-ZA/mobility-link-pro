
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import VehicleList from "@/components/VehicleList";
import VehicleDetail from "@/components/VehicleDetail";
import AuthPage from "@/components/AuthPage";
import UserHeader from "@/components/UserHeader";
import { Vehicle } from "@/hooks/useVehicles";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBackToList = () => {
    setSelectedVehicle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Fleet Manager</h1>
                <p className="text-sm text-slate-600">Enterprise Vehicle Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Online</span>
                </div>
                <div>Supabase Connected</div>
              </div>
              <UserHeader />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {selectedVehicle ? (
          <VehicleDetail 
            vehicle={selectedVehicle} 
            onBack={handleBackToList}
          />
        ) : (
          <VehicleList onVehicleSelect={handleVehicleSelect} />
        )}
      </main>
    </div>
  );
};

export default Index;
