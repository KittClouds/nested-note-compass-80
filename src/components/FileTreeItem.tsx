
import React, { useState } from 'react';
import { ChevronRight, File, Folder, FolderPlus, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { InlineEditor } from './InlineEditor';
import { useNotes } from '@/contexts/NotesContext';
import { FileSystemItem } from '@/types/notes';

interface FileTreeItemProps {
  item: FileSystemItem;
  level?: number;
}

export function FileTreeItem({ item, level = 0 }: FileTreeItemProps) {
  const { 
    state, 
    createNote, 
    createFolder, 
    renameItem, 
    deleteItem, 
    selectItem, 
    toggleFolder, 
    getItemsByParent 
  } = useNotes();
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isFolder = item.type === 'folder';
  const isExpanded = state.expandedFolders.has(item.id);
  const isSelected = state.selectedItemId === item.id;
  const children = getItemsByParent(item.id);

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(item.id);
    } else {
      selectItem(item.id);
    }
  };

  const handleRename = (newTitle: string) => {
    renameItem(item.id, newTitle);
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteItem(item.id);
    }
  };

  const paddingLeft = `${level * 12 + 8}px`;

  return (
    <>
      <SidebarMenuItem>
        <div 
          className="group relative"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <SidebarMenuButton
            className="w-full justify-start"
            data-active={isSelected}
            onClick={handleClick}
            style={{ paddingLeft }}
          >
            {isFolder && (
              <ChevronRight 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
            )}
            {isFolder ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
            
            {isRenaming ? (
              <InlineEditor
                value={item.title}
                onSave={handleRename}
                onCancel={() => setIsRenaming(false)}
                className="h-6 text-sm"
              />
            ) : (
              <span className="flex-1 truncate">{item.title}</span>
            )}
          </SidebarMenuButton>

          {/* Action buttons */}
          {showActions && !isRenaming && (
            <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isFolder && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      createNote(item.id);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      createFolder(item.id);
                    }}
                  >
                    <FolderPlus className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </SidebarMenuItem>

      {/* Render children */}
      {isFolder && isExpanded && children.length > 0 && (
        <SidebarMenuSub>
          {children.map(child => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
            />
          ))}
        </SidebarMenuSub>
      )}
    </>
  );
}
