
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useSites } from "@/hooks/useSites";
import { Badge } from "@/components/ui/badge";
import { MapPin, Settings } from "lucide-react";
import UserProfileSettings from "@/components/UserProfileSettings";

const UserHeader = () => {
  const { user, signOut } = useAuth();
  const { userRole } = useUserRole();
  const { userSite } = useSites();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  const handleProfileSettings = () => {
    setShowProfileSettings(true);
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = user.user_metadata?.full_name || user.email || 'User';
  const initials = getInitials(displayName);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarFallback className="bg-slate-100 text-slate-600">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-slate-500">{user.email}</p>
              {userRole && (
                <Badge className="mt-1 self-start" variant="outline">
                  {userRole === 'admin' ? 'Administrator' : 
                   userRole === 'fleet_admin' ? 'Fleet Manager' : 'User'}
                </Badge>
              )}
              {userSite && (
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span>{userSite.name}</span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleProfileSettings}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isSigningOut}
            onClick={handleSignOut}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <UserProfileSettings 
        isOpen={showProfileSettings} 
        onOpenChange={setShowProfileSettings} 
      />
    </>
  );
};

export default UserHeader;
