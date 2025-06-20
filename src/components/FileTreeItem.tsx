
import { useState } from 'react';
import { ChevronRight, File, Folder, MoreHorizontal, FolderPlus, FileText, Edit, Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { FileTreeItem as FileTreeItemType } from '@/types/notes';
import { useNotes } from '@/contexts/NotesContext';
import { CreateItemDialog } from '@/components/dialogs/CreateItemDialog';
import { RenameDialog } from '@/components/dialogs/RenameDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

interface FileTreeItemProps {
  item: FileTreeItemType;
  level?: number;
}

export function FileTreeItem({ item, level = 0 }: FileTreeItemProps) {
  const { 
    selectedNote, 
    selectNote, 
    createNote, 
    createFolder, 
    deleteItem, 
    renameItem, 
    getChildItems 
  } = useNotes();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<'note' | 'folder'>('note');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isFolder = item.type === 'folder';
  const isSelected = selectedNote?.id === item.id;
  const childItems = isFolder ? getChildItems(item.id) : [];
  const hasChildren = childItems.length > 0;

  const handleItemClick = () => {
    if (item.type === 'note') {
      selectNote(item.id);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCreateNote = () => {
    setCreateType('note');
    setShowCreateDialog(true);
  };

  const handleCreateFolder = () => {
    setCreateType('folder');
    setShowCreateDialog(true);
  };

  const handleCreate = (name: string) => {
    if (createType === 'note') {
      const newId = createNote(name, isFolder ? item.id : undefined);
      selectNote(newId);
    } else {
      createFolder(name, isFolder ? item.id : undefined);
    }
    setIsOpen(true);
  };

  const handleRename = (newName: string) => {
    renameItem(item.id, newName);
  };

  const handleDelete = () => {
    deleteItem(item.id);
  };

  const menuButton = (
    <SidebarMenuButton
      className={`group ${isSelected ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
      onClick={handleItemClick}
    >
      {isFolder && hasChildren && (
        <ChevronRight className={`transition-transform h-4 w-4 ${isOpen ? 'rotate-90' : ''}`} />
      )}
      {isFolder && !hasChildren && <div className="w-4" />}
      {isFolder ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
      <span className="truncate">{item.name}</span>
      {isFolder && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateNote();
          }}
        >
          <FileText className="h-3 w-3" />
        </Button>
      )}
    </SidebarMenuButton>
  );

  return (
    <>
      <SidebarMenuItem>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            {isFolder && hasChildren ? (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  {menuButton}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {childItems.map((child) => (
                      <FileTreeItem key={child.id} item={child} level={level + 1} />
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              menuButton
            )}
          </ContextMenuTrigger>
          <ContextMenuContent>
            {isFolder && (
              <>
                <ContextMenuItem onClick={handleCreateNote}>
                  <FileText className="h-4 w-4" />
                  New Note
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCreateFolder}>
                  <FolderPlus className="h-4 w-4" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem onClick={() => setShowRenameDialog(true)}>
              <Edit className="h-4 w-4" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarMenuItem>

      <CreateItemDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type={createType}
        onConfirm={handleCreate}
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        currentName={item.name}
        onConfirm={handleRename}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={item.name}
        itemType={item.type}
        onConfirm={handleDelete}
      />
    </>
  );
}
