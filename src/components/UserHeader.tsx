
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

const UserHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-slate-300">
          <User className="w-4 h-4" />
          <span className="hidden md:inline">
            {user?.user_metadata?.full_name || user?.email || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200">
        <DropdownMenuItem className="flex items-center gap-2 text-slate-700">
          <User className="w-4 h-4" />
          {user?.email}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserHeader;
