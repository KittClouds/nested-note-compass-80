
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { RightSidebar as RightSidebarWrapper } from './RightSidebarProvider';
import { ConnectionsPanelContainer } from './ConnectionsPanelContainer';

const RightSidebar = () => {
  const [connectionsOpen, setConnectionsOpen] = useState(true);

  return (
    <RightSidebarWrapper className="border-l border-border/50">
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
        
        <ConnectionsPanelContainer 
          isOpen={connectionsOpen}
          onToggle={() => setConnectionsOpen(!connectionsOpen)}
        />
        
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
    </RightSidebarWrapper>
  );
};

export default RightSidebar;
