
import { useState, useEffect } from "react";
import { useSites } from "@/hooks/useSites";
import { useAuth } from "@/hooks/useAuth";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UserProfileSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'site' | 'password'>('site');
  const { sites, userSite, updateUserSite } = useSites();
  const { user } = useAuth();
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  useEffect(() => {
    if (userSite) {
      setSelectedSiteId(userSite.id);
    }
  }, [userSite]);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && userSite) {
      setSelectedSiteId(userSite.id);
    } else if (open) {
      setSelectedSiteId("");
    }
    
    // Reset password fields when dialog closes
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab('site');
    }
  };
  
  const handleUpdateSite = async () => {
    if (!selectedSiteId) {
      toast({
        title: "No Site Selected",
        description: "Please select a site to update your assignment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    const result = await updateUserSite(selectedSiteId);
    setIsUpdating(false);
    
    if (result.success) {
      toast({
        title: "Site Updated",
        description: "Your site assignment has been updated successfully.",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update your site assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "The new password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Current Password Incorrect",
          description: "Please check your current password and try again.",
          variant: "destructive",
        });
        setIsChangingPassword(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast({
          title: "Password Update Failed",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsChangingPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Profile Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('site')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'site'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Site Assignment
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Change Password
          </button>
        </div>

        <div className="space-y-4 py-4">
          {activeTab === 'site' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Site Assignment</h3>
              <p className="text-sm text-slate-500">
                Select which site you are assigned to
              </p>
              
              <Select 
                value={selectedSiteId} 
                onValueChange={setSelectedSiteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} {site.location ? `(${site.location})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {userSite && (
                <p className="text-xs text-slate-400 mt-1">
                  Currently assigned to: {userSite.name} {userSite.location ? `(${userSite.location})` : ''}
                </p>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Change Password</h3>
              <p className="text-sm text-slate-500">
                Enter your current password and choose a new one
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {newPassword && newPassword.length < 6 && (
                <p className="text-xs text-red-500">Password must be at least 6 characters long</p>
              )}

              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {activeTab === 'site' && (
              <Button onClick={handleUpdateSite} disabled={!selectedSiteId || isUpdating}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            )}
            {activeTab === 'password' && (
              <Button 
                onClick={handleChangePassword} 
                disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6 || isChangingPassword}
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileSettings;
