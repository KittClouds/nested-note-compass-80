
import * as React from "react"
import { Plus, FileText, FolderPlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/contexts/NotesContext"
import { FileTreeItem } from "@/components/FileTreeItem"
import { CreateItemDialog } from "@/components/dialogs/CreateItemDialog"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { createNote, createFolder, selectNote, getChildItems } = useNotes();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [createType, setCreateType] = React.useState<'note' | 'folder'>('note');
  const [parentId, setParentId] = React.useState<string | null>(null);
  
  const rootItems = getChildItems(null);

  const handleCreateNote = (newParentId?: string) => {
    setCreateType('note');
    setParentId(newParentId || null);
    setShowCreateDialog(true);
  };

  const handleCreateFolder = (newParentId?: string) => {
    setCreateType('folder');
    setParentId(newParentId || null);
    setShowCreateDialog(true);
  };

  const handleCreate = (name: string) => {
    if (createType === 'note') {
      const newId = createNote(name, parentId || undefined);
      selectNote(newId);
    } else {
      createFolder(name, parentId || undefined);
    }
    setParentId(null);
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between p-2">
            <h2 className="text-lg font-semibold">Notes</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCreateNote()}>
                  <FileText className="h-4 w-4" />
                  New Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateFolder()}>
                  <FolderPlus className="h-4 w-4" />
                  New Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>All Notes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rootItems.map((item) => (
                  <FileTreeItem 
                    key={item.id} 
                    item={item} 
                    onCreateNote={handleCreateNote}
                    onCreateFolder={handleCreateFolder}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <CreateItemDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type={createType}
        onConfirm={handleCreate}
      />
    </>
  )
}
