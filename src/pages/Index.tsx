
import { AppSidebar } from "@/components/app-sidebar"
import RightSidebar from "@/components/RightSidebar"
import { RightSidebarProvider, RightSidebarTrigger } from "@/components/RightSidebarProvider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import RichEditor from "@/components/RichEditor";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { NotesProvider, useNotes } from "@/contexts/NotesContext";

function NotesApp() {
  const { theme } = useTheme();
  const { selectedNote, updateNoteContent } = useNotes();
  const [toolbarVisible, setToolbarVisible] = useState(true);

  const handleEditorChange = (content: string) => {
    if (selectedNote) {
      updateNoteContent(selectedNote.id, content);
    }
  };

  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Notes</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedNote?.name || 'Select a note'}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto">
                <RightSidebarTrigger />
              </div>
            </header>
            
            <div className="flex-1 h-[calc(100vh-4rem)]">
              {selectedNote ? (
                <RichEditor
                  content={selectedNote.content}
                  onChange={handleEditorChange}
                  isDarkMode={theme === 'dark'}
                  toolbarVisible={toolbarVisible}
                  onToolbarVisibilityChange={setToolbarVisible}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">No note selected</h3>
                    <p>Select a note from the sidebar or create a new one to get started.</p>
                  </div>
                </div>
              )}
            </div>
          </SidebarInset>
          <RightSidebar />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  );
}

const Index = () => {
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  );
}

export default Index
