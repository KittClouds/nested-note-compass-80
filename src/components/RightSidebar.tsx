
import React from 'react';
import { Settings, PanelRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Custom trigger for the right sidebar
const RightSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={toggleSidebar}
    >
      <PanelRight className="h-4 w-4" />
      <span className="sr-only">Toggle Right Sidebar</span>
    </Button>
  );
};

const RightSidebarContent = () => {
  return (
    <Sidebar side="right" className="border-l border-border/50">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Note Details</h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-auto p-0">
        <SidebarGroup>
          <SidebarGroupLabel>Note Properties</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-4">
              <div className="bg-muted/50 h-6 rounded"></div>
              <div className="bg-muted/50 h-6 rounded"></div>
              <div className="bg-muted/50 h-6 rounded"></div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-2">
              <div className="bg-muted/50 h-4 rounded"></div>
              <div className="bg-muted/50 h-4 rounded"></div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Statistics</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-2">
              <div className="bg-muted/50 h-4 rounded"></div>
              <div className="bg-muted/50 h-4 rounded"></div>
              <div className="bg-muted/50 h-4 rounded"></div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

// Main component that wraps the sidebar in its own provider
const RightSidebar = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <RightSidebarContent />
    </SidebarProvider>
  );
};

export default RightSidebar;
export { RightSidebarTrigger };
