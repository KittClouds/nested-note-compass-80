
export interface Note {
  id: string; // UUID v4
  name: string;
  content: string; // TipTap JSON
  type: 'note';
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string; // UUID v4
  name: string;
  type: 'folder';
  parentId: string | null;
  children: string[]; // Array of child IDs
  createdAt: Date;
  updatedAt: Date;
}

export type FileTreeItem = Note | Folder;

export interface FileTreeState {
  items: Map<string, FileTreeItem>;
  rootItems: string[]; // IDs of root level items
  selectedNoteId: string | null;
}

export interface NotesContextType {
  state: FileTreeState;
  selectedNote: Note | null;
  createNote: (name: string, parentId?: string) => string;
  createFolder: (name: string, parentId?: string) => string;
  deleteItem: (id: string) => void;
  renameItem: (id: string, newName: string) => void;
  selectNote: (id: string) => void;
  updateNoteContent: (id: string, content: string) => void;
  getChildItems: (parentId: string | null) => FileTreeItem[];
}
