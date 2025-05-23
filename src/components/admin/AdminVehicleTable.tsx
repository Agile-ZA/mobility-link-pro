
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit } from "lucide-react";
import { Vehicle } from "@/types/vehicle";

interface AdminVehicleTableProps {
  vehicles: Vehicle[];
  onEditVehicle: (vehicle: Vehicle) => void;
}

const getStatusBadgeProps = (status: Vehicle['status']) => {
  switch (status) {
    case 'available':
      return { 
        variant: 'default' as const, 
        className: 'bg-green-600 hover:bg-green-700 text-white border-0' 
      };
    case 'booked':
      return { 
        variant: 'secondary' as const, 
        className: 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
      };
    case 'maintenance':
      return { 
        variant: 'destructive' as const, 
        className: 'bg-amber-600 hover:bg-amber-700 text-white border-0' 
      };
    case 'damaged':
      return { 
        variant: 'destructive' as const, 
        className: 'bg-red-600 hover:bg-red-700 text-white border-0' 
      };
    default:
      return { 
        variant: 'outline' as const, 
        className: '' 
      };
  }
};

const AdminVehicleTable = ({ vehicles, onEditVehicle }: AdminVehicleTableProps) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Edit className="w-5 h-5" />
          All Vehicles ({vehicles.length})
        </CardTitle>
        <p className="text-slate-600 text-sm">
          View and edit all vehicles in the fleet
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Current User</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => {
              const badgeProps = getStatusBadgeProps(vehicle.status);
              return (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registration_number}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model} ({vehicle.year})</TableCell>
                  <TableCell className="capitalize">{vehicle.type}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={badgeProps.variant}
                      className={badgeProps.className}
                    >
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vehicle.site?.name || 'No site assigned'}
                  </TableCell>
                  <TableCell>
                    {vehicle.profile?.full_name || vehicle.profile?.email || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditVehicle(vehicle)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {vehicles.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No vehicles found. Add your first vehicle to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminVehicleTable;
