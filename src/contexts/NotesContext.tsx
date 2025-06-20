import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, Folder, FileTreeItem, FileTreeState, NotesContextType } from '@/types/notes';
import { generateId } from '@/utils/parsingUtils';

const NotesContext = createContext<NotesContextType | null>(null);

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

const STORAGE_KEY = 'notes-app-data';

function createInitialState(): FileTreeState {
  // Create a welcome note
  const welcomeNoteId = generateId();
  const welcomeNote: Note = {
    id: welcomeNoteId,
    name: 'Welcome',
    content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Welcome to your note editor! Try typing some notes with special syntax like #tags, [[wiki links]], or <<cross links>>."}]}]}',
    type: 'note',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const items = new Map<string, FileTreeItem>();
  items.set(welcomeNoteId, welcomeNote);

  return {
    items,
    rootItems: [welcomeNoteId],
    selectedNoteId: welcomeNoteId,
  };
}

function saveToStorage(state: FileTreeState) {
  try {
    const serializable = {
      items: Array.from(state.items.entries()).map(([id, item]) => [id, {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }]),
      rootItems: state.rootItems,
      selectedNoteId: state.selectedNoteId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromStorage(): FileTreeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialState();

    const parsed = JSON.parse(stored);
    const items = new Map<string, FileTreeItem>();
    
    parsed.items.forEach(([id, item]: [string, any]) => {
      items.set(id, {
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });

    return {
      items,
      rootItems: parsed.rootItems,
      selectedNoteId: parsed.selectedNoteId,
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return createInitialState();
  }
}

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [state, setState] = useState<FileTreeState>(loadFromStorage);
  const [isCreating, setIsCreating] = useState(false);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(state);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  const selectedNote = state.selectedNoteId 
    ? (state.items.get(state.selectedNoteId) as Note) || null
    : null;

  const createNote = (name: string, parentId?: string): string => {
    if (isCreating) return '';
    
    setIsCreating(true);
    const id = generateId();
    const note: Note = {
      id,
      name,
      content: '{"type":"doc","content":[{"type":"paragraph"}]}',
      type: 'note',
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => {
      const newItems = new Map(prev.items);
      newItems.set(id, note);

      let newRootItems = [...prev.rootItems];
      
      if (parentId) {
        const parent = newItems.get(parentId) as Folder;
        if (parent && parent.type === 'folder') {
          const updatedParent = {
            ...parent,
            children: [...parent.children, id],
            updatedAt: new Date(),
          };
          newItems.set(parentId, updatedParent);
        }
      } else {
        newRootItems.push(id);
      }

      return {
        ...prev,
        items: newItems,
        rootItems: newRootItems,
        selectedNoteId: id,
      };
    });

    setIsCreating(false);
    return id;
  };

  const createFolder = (name: string, parentId?: string): string => {
    if (isCreating) return '';
    
    setIsCreating(true);
    const id = generateId();
    const folder: Folder = {
      id,
      name,
      type: 'folder',
      parentId: parentId || null,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => {
      const newItems = new Map(prev.items);
      newItems.set(id, folder);

      let newRootItems = [...prev.rootItems];
      
      if (parentId) {
        const parent = newItems.get(parentId) as Folder;
        if (parent && parent.type === 'folder') {
          const updatedParent = {
            ...parent,
            children: [...parent.children, id],
            updatedAt: new Date(),
          };
          newItems.set(parentId, updatedParent);
        }
      } else {
        newRootItems.push(id);
      }

      return {
        ...prev,
        items: newItems,
        rootItems: newRootItems,
      };
    });

    setIsCreating(false);
    return id;
  };

  const deleteItem = (id: string) => {
    setState(prev => {
      const newItems = new Map(prev.items);
      const item = newItems.get(id);
      if (!item) return prev;

      // Recursively delete children if it's a folder
      if (item.type === 'folder') {
        const deleteRecursive = (itemId: string) => {
          const currentItem = newItems.get(itemId);
          if (currentItem?.type === 'folder') {
            currentItem.children.forEach(deleteRecursive);
          }
          newItems.delete(itemId);
        };
        deleteRecursive(id);
      } else {
        newItems.delete(id);
      }

      // Remove from parent's children or root items
      if (item.parentId) {
        const parent = newItems.get(item.parentId) as Folder;
        if (parent && parent.type === 'folder') {
          const updatedParent = {
            ...parent,
            children: parent.children.filter(childId => childId !== id),
            updatedAt: new Date(),
          };
          newItems.set(item.parentId, updatedParent);
        }
      } else {
        const newRootItems = prev.rootItems.filter(itemId => itemId !== id);
        return {
          ...prev,
          items: newItems,
          rootItems: newRootItems,
          selectedNoteId: prev.selectedNoteId === id ? null : prev.selectedNoteId,
        };
      }

      return {
        ...prev,
        items: newItems,
        selectedNoteId: prev.selectedNoteId === id ? null : prev.selectedNoteId,
      };
    });
  };

  const renameItem = (id: string, newName: string) => {
    setState(prev => {
      const newItems = new Map(prev.items);
      const item = newItems.get(id);
      if (!item) return prev;

      const updatedItem = {
        ...item,
        name: newName,
        updatedAt: new Date(),
      };
      newItems.set(id, updatedItem);

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const selectNote = (id: string) => {
    const item = state.items.get(id);
    if (item && item.type === 'note') {
      setState(prev => ({
        ...prev,
        selectedNoteId: id,
      }));
    }
  };

  const updateNoteContent = (id: string, content: string) => {
    setState(prev => {
      const newItems = new Map(prev.items);
      const note = newItems.get(id) as Note;
      if (!note || note.type !== 'note') return prev;

      const updatedNote: Note = {
        ...note,
        content,
        updatedAt: new Date(),
      };
      newItems.set(id, updatedNote);

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const getChildItems = (parentId: string | null): FileTreeItem[] => {
    if (parentId === null) {
      return state.rootItems
        .map(id => state.items.get(id))
        .filter((item): item is FileTreeItem => item !== undefined)
        .sort((a, b) => {
          // Folders first, then notes, then by name
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
    }

    const parent = state.items.get(parentId);
    if (!parent || parent.type !== 'folder') return [];

    return parent.children
      .map(id => state.items.get(id))
      .filter((item): item is FileTreeItem => item !== undefined)
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  };

  const contextValue: NotesContextType = {
    state,
    selectedNote,
    createNote,
    createFolder,
    deleteItem,
    renameItem,
    selectNote,
    updateNoteContent,
    getChildItems,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}
