
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import VehicleList from "@/components/VehicleList";
import VehicleDetail from "@/components/VehicleDetail";
import AuthPage from "@/components/AuthPage";
import UserHeader from "@/components/UserHeader";
import AdminPanel from "@/components/AdminPanel";
import { Vehicle } from "@/types/vehicle";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const Index = () => {
  const { user, loading } = useAuth();
  const { isFleetAdmin } = useUserRole();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentView, setCurrentView] = useState<'vehicles' | 'admin'>('vehicles');

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBackToList = () => {
    setSelectedVehicle(null);
  };

  const handleNavigation = (view: 'vehicles' | 'admin') => {
    setCurrentView(view);
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

  const renderContent = () => {
    if (currentView === 'admin' && isFleetAdmin) {
      return <AdminPanel onNavigateBack={() => handleNavigation('vehicles')} />;
    }

    if (selectedVehicle) {
      return (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          onBack={handleBackToList}
        />
      );
    }

    return <VehicleList onVehicleSelect={handleVehicleSelect} />;
  };

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
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => handleNavigation('vehicles')}
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'vehicles'
                      ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vehicles
                </button>
                {isFleetAdmin && (
                  <button
                    onClick={() => handleNavigation('admin')}
                    className={`text-sm font-medium transition-colors ${
                      currentView === 'admin'
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Administration
                  </button>
                )}
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Online</span>
                </div>
              </nav>
              <UserHeader />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
