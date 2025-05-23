
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSites } from "@/hooks/useSites";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

const UserProfileSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { sites, userSite, updateUserSite } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && userSite) {
      setSelectedSiteId(userSite.id);
    }
  };
  
  const handleUpdateSite = async () => {
    if (!selectedSiteId) return;
    
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
                    {site.name} ({site.location || 'No location'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSite} disabled={!selectedSiteId || isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileSettings;
