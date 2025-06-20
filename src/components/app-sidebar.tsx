
import * as React from "react"
import { ChevronRight, File, Folder, Plus, MoreHorizontal } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Sample note structure - this will be replaced with real data later
const noteData = {
  folders: [
    {
      name: "Work",
      notes: [
        "Meeting Notes - Q4 Planning",
        "Project Requirements",
        "Team Feedback"
      ],
      subfolders: [
        {
          name: "Projects",
          notes: [
            "Website Redesign",
            "Mobile App Features"
          ]
        }
      ]
    },
    {
      name: "Personal",
      notes: [
        "Daily Journal",
        "Book Ideas",
        "Travel Plans"
      ],
      subfolders: [
        {
          name: "Learning",
          notes: [
            "React 19 Notes",
            "TypeScript Tips"
          ]
        }
      ]
    },
    {
      name: "Archive",
      notes: [
        "Old Meeting Notes",
        "Completed Projects"
      ]
    }
  ],
  recentNotes: [
    "Daily Journal",
    "React 19 Notes",
    "Meeting Notes - Q4 Planning"
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {noteData.recentNotes.map((note, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <File className="h-4 w-4" />
                    {note}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>All Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {noteData.folders.map((folder, index) => (
                <FolderTree key={index} folder={folder} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function FolderTree({ folder }: { folder: any }) {
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={folder.name === "Work"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="group">
            <ChevronRight className="transition-transform h-4 w-4" />
            <Folder className="h-4 w-4" />
            {folder.name}
            <Button 
              size="sm" 
              variant="ghost" 
              className="ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {/* Render notes in this folder */}
            {folder.notes?.map((note: string, index: number) => (
              <SidebarMenuItem key={`note-${index}`}>
                <SidebarMenuButton className="pl-8">
                  <File className="h-4 w-4" />
                  {note}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {/* Render subfolders */}
            {folder.subfolders?.map((subfolder: any, index: number) => (
              <SidebarMenuItem key={`subfolder-${index}`}>
                <Collapsible className="group/subcollapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="pl-4 group">
                      <ChevronRight className="transition-transform h-4 w-4" />
                      <Folder className="h-4 w-4" />
                      {subfolder.name}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {subfolder.notes?.map((note: string, noteIndex: number) => (
                        <SidebarMenuItem key={`subnote-${noteIndex}`}>
                          <SidebarMenuButton className="pl-12">
                            <File className="h-4 w-4" />
                            {note}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
