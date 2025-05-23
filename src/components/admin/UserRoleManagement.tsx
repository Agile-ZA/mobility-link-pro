
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useUserManagement, UserWithRole } from "@/hooks/useUserManagement";
import { UserRole, useUserRole } from "@/hooks/useUserRole";
import { Users } from "lucide-react";
import { Loader2 } from "lucide-react";

interface UserRoleManagementProps {
  isOpen: boolean;
}

const UserRoleManagement = ({ isOpen }: UserRoleManagementProps) => {
  const { users, loading, assignRole, removeRole } = useUserManagement();
  const { userRole } = useUserRole();
  
  if (!isOpen) return null;

  const getRoleBadge = (role: UserRole | null) => {
    if (!role) return <Badge variant="outline">No Role</Badge>;
    
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>;
      case 'fleet_admin':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Fleet Admin</Badge>;
      case 'user':
        return <Badge className="bg-slate-600 hover:bg-slate-700">User</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRoleChange = (userId: string, value: string | null) => {
    if (!value) {
      removeRole(userId);
    } else {
      assignRole(userId, value as UserRole);
    }
  };

  // Fleet admins cannot assign admin roles
  const canAssignRole = (role: UserRole) => {
    if (userRole === 'admin') return true;
    if (userRole === 'fleet_admin' && role !== 'admin') return true;
    return false;
  };

  return (
    <Card className="border-slate-200 mt-6">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Role Management
        </CardTitle>
        <p className="text-slate-600 text-sm">
          Manage user roles and permissions
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No users found in the system.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Assign Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: UserWithRole) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role || ""}
                        onValueChange={(value) => handleRoleChange(
                          user.id, 
                          value === "" ? null : value
                        )}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Role</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="fleet_admin">Fleet Admin</SelectItem>
                          {userRole === 'admin' && (
                            <SelectItem value="admin">Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleManagement;
