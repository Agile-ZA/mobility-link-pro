
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserHeader = () => {
  const { user, signOut } = useAuth();
  const { userRole, isFleetAdmin } = useUserRole();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleBadge = () => {
    if (!userRole) return null;
    
    const roleConfig = {
      admin: { label: 'Admin', className: 'bg-red-600 text-white' },
      fleet_admin: { label: 'Fleet Admin', className: 'bg-blue-600 text-white' },
      user: { label: 'User', className: 'bg-slate-600 text-white' }
    };

    const config = roleConfig[userRole];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-slate-900 leading-none">
                  {user.user_metadata?.full_name || user.email}
                </p>
                {getRoleBadge()}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {user.email}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-slate-600">{user.email}</p>
              {getRoleBadge()}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isFleetAdmin && (
          <>
            <DropdownMenuItem disabled>
              Fleet Management Access
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserHeader;
